// ==========================================
// 1. IMPORT CLOUDINARY
// ==========================================

// Import the Cloudinary SDK.
const cloudinary = require("cloudinary").v2;

// ==========================================
// 2. CONFIGURE CLOUDINARY
// ==========================================

// Connect our backend to our Cloudinary account
// using credentials stored in the .env file.
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ==========================================
// 3. EXPORT CLOUDINARY
// ==========================================

// Export the configured Cloudinary instance
// so other backend files can use it.
module.exports = cloudinary;
