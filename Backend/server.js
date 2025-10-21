import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";

// Routes
import bookRoutes from "./routes/bookRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import userRoutes from "./routes/userRoutes.js"; // ✅ Add this

// Load environment variables
dotenv.config();
import "./models/userModel.js";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB();

// Root endpoint
app.get("/", (req, res) => {
  res.send("📚 Welcome to the Online Bookstore API");
});

// API Routes
app.use("/api/books", bookRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/users", userRoutes); // ✅ Mount user routes

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "❌ Route not found" });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("❌ Global Error:", err);
  res.status(500).json({ message: "Internal Server Error" });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
