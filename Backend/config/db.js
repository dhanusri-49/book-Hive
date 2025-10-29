import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables from .env

const connectDB = async () => {
  try {
    if (!process.env.DATABASE_URL) {
      throw new Error("DATABASE_URL not defined in .env");
    }

    console.log("🔄 Attempting to connect to MongoDB...");
    
    await mongoose.connect(process.env.DATABASE_URL, {
      serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds
      socketTimeoutMS: 45000,
    });

    console.log("✅ MongoDB Connected Successfully");
  } catch (err) {
    console.error("❌ MongoDB Connection Error:", err.message);
    console.error("Full error:", err);
    process.exit(1); // Exit process on DB failure
  }
};

export default connectDB;
