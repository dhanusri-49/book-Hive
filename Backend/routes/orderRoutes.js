import express from "express";
import addOrder from "../controllers/orderController/addOrder.js";
import getOrders from "../controllers/orderController/getOrders.js";
import updateOrder from "../controllers/orderController/updateOrder.js";
import deleteOrder from "../controllers/orderController/deleteOrder.js";
import { verifyToken, requireAdmin } from "../middleware/auth.js";

const router = express.Router();

// Public route - anyone can view orders
router.get("/", getOrders);

// Protected routes - authenticated users can create orders for themselves
router.post("/", verifyToken, addOrder);

// Admin-only routes
router.put("/:id", requireAdmin, updateOrder);
router.delete("/:id", requireAdmin, deleteOrder);

export default router;
