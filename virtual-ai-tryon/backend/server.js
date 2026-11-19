// ==========================================
// 1. IMPORT REQUIRED PACKAGES
// ==========================================

// Express is used to create our backend server and APIs.
const express = require("express");

// CORS allows communication between frontend and backend.
const cors = require("cors");

// Load environment variables from the .env file.
require("dotenv").config();

// Import the MongoDB connection function.
const connectDB = require("./config/db");

// Import product API routes.
const productRoutes = require("./routes/productRoutes");

// Import Cloudinary configuration.
const cloudinary = require("./config/cloudinary");

// ==========================================
// 2. INITIALIZE EXPRESS APPLICATION
// ==========================================

const app = express();

// ==========================================
// 3. CONFIGURE MIDDLEWARE
// ==========================================

// Enable CORS for frontend-backend communication.
app.use(cors());

// Parse incoming JSON request data.
app.use(express.json());

// Register product API routes.
// All product endpoints will start with /api/products.
app.use("/api/products", productRoutes);

// ==========================================
// 4. CREATE TEST API ROUTE
// ==========================================

// Check whether the backend server is running.
app.get("/", (req, res) => {
  res.send("Virtual AI Try-On Studio Backend is Running!");
});

// ==========================================
// TEST CLOUDINARY CONNECTION
// ==========================================

app.get("/api/test-cloudinary", async (req, res) => {
  try {
    // Request account information from Cloudinary.
    const result = await cloudinary.api.ping();

    // Send successful response.
    res.status(200).json({
      success: true,
      message: "Cloudinary connected successfully!",
      status: result.status,
    });
  } catch (error) {
    // Handle connection errors.
    console.error("Cloudinary connection error:", error.message);

    res.status(500).json({
      success: false,
      message: "Cloudinary connection failed.",
      error: error.message,
    });
  }
});

// ==========================================
// 5. START SERVER AFTER DATABASE CONNECTION
// ==========================================

// Get the port from environment variables.
// Use 5000 if no port is specified.
const PORT = process.env.PORT || 5000;

// Create an asynchronous function to start the application.
const startServer = async () => {
  // First, establish a connection with MongoDB Atlas.
  await connectDB();

  // Start Express only after the database connects successfully.
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

// Execute the server startup function.
startServer();
