const express = require("express");
const mongoose = require("mongoose");
const Product = require("../models/product");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const products = await Product.find();

    res.status(200).json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch products",
      error: error.message,
    });
  }
});

// GET /api/products/:id
// Fetch a single product using its MongoDB ID.
router.get("/:id", async (req, res) => {
  try {
    // Extract the product ID from the URL.
    const { id } = req.params;

    // Check whether the ID is a valid MongoDB ObjectId.
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID",
      });
    }

    // Find the product using its MongoDB ID.
    const product = await Product.findById(id);

    // Check whether the product exists.
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Return the requested product.
    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch product",
      error: error.message,
    });
  }
});

// POST /api/products
// Receive product information and save it in MongoDB.
router.post("/", async (req, res) => {
  try {
    // Extract product information from the request body.
    const {
      name,
      category,
      price,
      image,
      imagePublicId,
      description,
      sizes,
      colors,
      gender,
      colorVariants,
    } = req.body;

    // Create a new product document using the Product model.
    const newProduct = await Product.create({
      name,
      category,
      price,
      image,
      imagePublicId,
      description,
      sizes,
      colors,
      gender,
      colorVariants,
    });

    // Send a success response with the newly created product.
    res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: newProduct,
    });
  } catch (error) {
    // Handle validation errors and other database errors.
    res.status(400).json({
      success: false,
      message: "Failed to create product",
      error: error.message,
    });
  }
});

module.exports = router;
