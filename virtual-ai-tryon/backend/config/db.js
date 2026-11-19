// ==========================================
// 1. IMPORT MONGOOSE
// ==========================================

// Mongoose helps Node.js communicate with MongoDB.
// It also provides schemas and models for managing database data.
const mongoose = require("mongoose");

// ==========================================
// 2. CONNECT TO MONGODB ATLAS
// ==========================================

// This function establishes a connection between
// our Express backend and MongoDB Atlas.
const connectDB = async () => {
  try {
    // Connect to MongoDB using the connection string
    // stored in the environment variables.
    const conn = await mongoose.connect(process.env.MONGO_URI);

    // Display a success message with the connected database host.
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    // Display the error if the database connection fails.
    console.error(`MongoDB Connection Error: ${error.message}`);

    // Stop the application if the database connection fails.
    process.exit(1);
  }
};

// ==========================================
// 3. EXPORT DATABASE CONNECTION FUNCTION
// ==========================================

// Export the function so server.js can use it.
module.exports = connectDB;
