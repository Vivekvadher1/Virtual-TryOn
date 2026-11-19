const express = require("express");
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

// POST /api/products
// Receive product information and save it in MongoDB.
router.post("/", async (req, res) => {
  try {
    // Extract product information from the request body.
    const { name, category, price, image, description, sizes, colors } =
      req.body;

    // Create a new product document using the Product model.
    const newProduct = await Product.create({
      name,
      category,
      price,
      image,
      description,
      sizes,
      colors,
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
