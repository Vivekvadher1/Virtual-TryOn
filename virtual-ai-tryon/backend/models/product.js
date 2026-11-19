// ==========================================
// 1. IMPORT MONGOOSE
// ==========================================

// Mongoose is used to define schemas and models
// for storing and managing MongoDB documents.
const mongoose = require("mongoose");

// ==========================================
// 2. DEFINE PRODUCT SCHEMA
// ==========================================

// A schema defines the structure and validation
// rules for every product stored in MongoDB.
const productSchema = new mongoose.Schema(
  {
    // Product name
    name: {
      type: String,
      required: true,
      trim: true,
    },

    // Product category
    category: {
      type: String,
      required: true,
      enum: ["Clothing", "Shoes", "Bags", "Accessories"],
    },

    // Product price in INR
    price: {
      type: Number,
      required: true,
      min: 0,
    },

    // Product image URL from Cloudinary.
    // The frontend will use this URL to display the image.
    image: {
      type: String,
      required: true,
    },

    // Cloudinary public ID.
    // Used later when replacing or deleting product images.
    imagePublicId: {
      type: String,
      required: true,
    },

    // Product description
    description: {
      type: String,
      required: true,
      trim: true,
    },

    // Available product sizes
    // Optional because bags and accessories may not have sizes.
    sizes: {
      type: [String],
      default: [],
    },

    // Available product colors
    colors: {
      type: [String],
      default: [],
    },
  },

  {
    // Automatically create createdAt and updatedAt fields.
    timestamps: true,
  },
);

// ==========================================
// 3. CREATE AND EXPORT PRODUCT MODEL
// ==========================================

// Create a Mongoose model using the product schema.
// MongoDB will store these documents in the products collection.
const Product = mongoose.model("Product", productSchema);

module.exports = Product;
