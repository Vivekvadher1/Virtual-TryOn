const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const cloudinary = require("../config/cloudinary");

const router = express.Router();

const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const CATEGORY_FOLDERS = {
  clothing: "virtual-ai-tryon/products/clothing",
  shoes: "virtual-ai-tryon/products/shoes",
  bags: "virtual-ai-tryon/products/bags",
  accessories: "virtual-ai-tryon/products/accessories",
};

function resolveCloudinaryFolder(categoryInput) {
  const normalized = String(categoryInput || "clothing")
    .trim()
    .toLowerCase();
  return CATEGORY_FOLDERS[normalized] || CATEGORY_FOLDERS.clothing;
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const safeName = file.originalname.replace(/\s+/g, "-");
    cb(null, `${Date.now()}-${safeName}`);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed!"), false);
    }
  },
});

// Separate upload configuration for user Try-On photos.
const userPhotoUpload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // Maximum 5 MB
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only JPG, PNG, and WEBP images are allowed!"), false);
    }
  },
});

async function removeTempFile(filePath) {
  if (!filePath) return;
  try {
    await fs.promises.unlink(filePath);
  } catch {
    // Ignore cleanup errors if the file was already removed.
  }
}

router.post("/image", upload.single("image"), async (req, res) => {
  const tempFilePath = req.file?.path;

  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please select an image.",
      });
    }

    const folder = resolveCloudinaryFolder(req.body?.category);

    const result = await cloudinary.uploader.upload(tempFilePath, {
      folder,
    });

    await removeTempFile(tempFilePath);

    return res.status(200).json({
      success: true,
      message: "Image uploaded successfully!",
      folder,
      image: {
        url: result.secure_url,
        public_id: result.public_id,
      },
    });
  } catch (error) {
    console.log("========== CLOUDINARY ERROR ==========");
    console.dir(error, { depth: null, colors: true });
    console.log("Error message:", error.message);
    console.log("HTTP code:", error.http_code);
    console.log("Response:", error.response);
    console.log("======================================");

    await removeTempFile(tempFilePath);

    return res.status(500).json({
      success: false,
      message: "Image upload failed.",
      error: error.message,
      http_code: error.http_code,
    });
  }
});

// ==========================================
// USER TRY-ON PHOTO UPLOAD
// ==========================================

router.post(
  "/user-photo",
  userPhotoUpload.single("photo"),
  async (req, res) => {
    const tempFilePath = req.file?.path;

    try {
      // Check whether the user selected a photo.
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "Please select a user photo.",
        });
      }

      // Upload the user's photo to a separate Cloudinary folder.
      const result = await cloudinary.uploader.upload(tempFilePath, {
        folder: "virtual-ai-tryon/user-photos",
      });

      // Remove the temporary local file.
      await removeTempFile(tempFilePath);

      return res.status(200).json({
        success: true,
        message: "User photo uploaded successfully!",
        image: {
          url: result.secure_url,
          public_id: result.public_id,
        },
      });
    } catch (error) {
      console.error("User photo upload error:", error);

      // Clean up the temporary file if uploading fails.
      await removeTempFile(tempFilePath);

      return res.status(500).json({
        success: false,
        message: "User photo upload failed.",
        error: error.message,
      });
    }
  },
);

module.exports = router;
