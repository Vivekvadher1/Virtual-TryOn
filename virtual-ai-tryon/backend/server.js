// Load environment variables first so every imported module can access them.
require("dotenv").config();

const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");
const productRoutes = require("./routes/productRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const cloudinary = require("./config/cloudinary");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/products", productRoutes);
app.use("/api/upload", uploadRoutes);

app.get("/", (req, res) => {
  res.send("Virtual AI Try-On Studio Backend is Running!");
});

// Test Cloudinary credentials and connectivity.
app.get("/api/test-cloudinary", async (req, res) => {
  try {
    const result = await cloudinary.api.ping();

    res.status(200).json({
      success: true,
      message: "Cloudinary connected successfully!",
      status: result.status,
    });
  } catch (error) {
    console.error("Cloudinary connection error:", error);

    res.status(500).json({
      success: false,
      message: "Cloudinary connection failed.",
      error: error.message,
      http_code: error.http_code,
    });
  }
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

startServer();
