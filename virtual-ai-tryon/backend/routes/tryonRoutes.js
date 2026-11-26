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

// Normalize person photos (including wide landscape virtual models)
// into a 3:4 portrait JPG centered on the subject.
function toPortraitCloudinaryUrl(imageUrl) {
  const marker = "/image/upload/";
  if (!imageUrl.includes(marker)) return imageUrl;

  const [prefix, rest] = imageUrl.split(marker);
  const cleanPublicId = rest.replace(/\.[a-zA-Z0-9]+(\?.*)?$/, "");

  return `${prefix}${marker}c_fill,g_auto,w_768,h_1024,f_jpg,q_auto,a_exif/${cleanPublicId}.jpg`;
}

// Normalize garment images into standard RGB JPGs within 1024x1024.
function toGarmentCloudinaryUrl(imageUrl) {
  const marker = "/image/upload/";
  if (!imageUrl.includes(marker)) return imageUrl;

  const [prefix, rest] = imageUrl.split(marker);
  const cleanPublicId = rest.replace(/\.[a-zA-Z0-9]+(\?.*)?$/, "");

  return `${prefix}${marker}c_limit,w_1024,h_1024,f_jpg,q_auto,a_exif/${cleanPublicId}.jpg`;
}

// ==========================================
// VIRTUAL AI TRY-ON
// ==========================================

router.post("/", async (req, res) => {
  try {
    const { personImageUrl, garmentImageUrl, garmentDescription } = req.body;

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

    if (typeof garmentDescription !== "string" || !garmentDescription.trim()) {
      return res.status(400).json({
        success: false,
        message: "Garment description is required.",
      });
    }

    const formattedPersonUrl = toPortraitCloudinaryUrl(personImageUrl);
    const formattedGarmentUrl = toGarmentCloudinaryUrl(garmentImageUrl);

    console.log("Starting IDM-VTON generation...", {
      formattedPersonUrl,
      formattedGarmentUrl,
      garmentDescription: garmentDescription.trim(),
    });

    // Connect to the hosted IDM-VTON model.
    const { client, handle_file } = await getGradioClient();

    // Send the person and garment images to IDM-VTON.
    const result = await client.predict("/tryon", {
      dict: {
        background: handle_file(formattedPersonUrl),
        layers: [],
        composite: null,
      },
      garm_img: handle_file(formattedGarmentUrl),
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
    // Reset cached Gradio client if the session errored out
    gradioPromise = null;
    console.error("IDM-VTON generation error:", error);

    return res.status(500).json({
      success: false,
      message: "Virtual try-on generation failed.",
      error: error.message,
    });
  }
});

module.exports = router;
