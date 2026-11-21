
const express = require("express");

const router = express.Router();

// Reuse the Gradio connection instead of reconnecting
// every time someone requests a virtual try-on.
let gradioPromise = null;

async function getGradioClient() {
  if (!gradioPromise) {
    gradioPromise = (async () => {
      const { Client, handle_file } = await import("@gradio/client");

      const client = await Client.connect("yisol/IDM-VTON");

      return { client, handle_file };
    })();
  }

  try {
    return await gradioPromise;
  } catch (error) {
    gradioPromise = null;
    throw error;
  }
}

// Check that the supplied images are Cloudinary URLs.
function isValidCloudinaryUrl(imageUrl) {
  try {
    const parsedUrl = new URL(imageUrl);

    return (
      parsedUrl.protocol === "https:" &&
      parsedUrl.hostname === "res.cloudinary.com"
    );
  } catch {
    return false;
  }
}

// ==========================================
// VIRTUAL AI TRY-ON
// ==========================================

router.post("/", async (req, res) => {
  try {
    const {
      personImageUrl,
      garmentImageUrl,
      garmentDescription,
    } = req.body;

    // Validate required inputs.
    if (!personImageUrl || !garmentImageUrl) {
      return res.status(400).json({
        success: false,
        message: "Person image and garment image are required.",
      });
    }

    if (
      !isValidCloudinaryUrl(personImageUrl) ||
      !isValidCloudinaryUrl(garmentImageUrl)
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide valid Cloudinary image URLs.",
      });
    }

    if (
      typeof garmentDescription !== "string" ||
      !garmentDescription.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "Garment description is required.",
      });
    }

    console.log("Starting IDM-VTON generation...");

    // Connect to the hosted IDM-VTON model.
    const { client, handle_file } = await getGradioClient();

    // Send the person and garment images to IDM-VTON.
    const result = await client.predict("/tryon", {
      dict: {
        background: handle_file(personImageUrl),
        layers: [],
        composite: null,
      },
      garm_img: handle_file(garmentImageUrl),
      garment_des: garmentDescription.trim(),
      is_checked: true,
      is_checked_crop: false,
      denoise_steps: 30,
      seed: 42,
    });

    console.log("IDM-VTON generation completed.");

    const generatedImage = result.data?.[0];
    const maskedImage = result.data?.[1];

    if (!generatedImage) {
      throw new Error("IDM-VTON did not return a generated image.");
    }

    return res.status(200).json({
      success: true,
      message: "Virtual try-on generated successfully!",
      image: generatedImage,
      imageUrl:
        typeof generatedImage === "string"
          ? generatedImage
          : generatedImage.url,
      maskedImage,
    });
  } catch (error) {
    console.error("IDM-VTON generation error:", error);

    return res.status(500).json({
      success: false,
      message: "Virtual try-on generation failed.",
      error: error.message,
    });
  }
});

module.exports = router;
