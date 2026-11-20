const cloudinary = require("cloudinary").v2;

const cloudName = process.env.CLOUDINARY_CLOUD_NAME?.trim();
const apiKey = process.env.CLOUDINARY_API_KEY?.trim();
const apiSecret = process.env.CLOUDINARY_API_SECRET?.trim();

if (!cloudName || !apiKey || !apiSecret) {
  console.warn("Missing Cloudinary environment variables:", {
    hasCloudName: Boolean(cloudName),
    hasApiKey: Boolean(apiKey),
    hasApiSecret: Boolean(apiSecret),
  });
}

cloudinary.config({
  cloud_name: cloudName,
  api_key: apiKey,
  api_secret: apiSecret,
  debug: true,
});

module.exports = cloudinary;