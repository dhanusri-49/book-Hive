import express from "express";
import userController from "../controllers/userController.js";
import { verifyToken, requireAdmin } from "../middleware/auth.js";
import { addToWishlist, removeFromWishlist, getWishlist } from "../controllers/userController/wishlist.js";

const router = express.Router();

// Public route - anyone can view users
router.get("/", userController.getUsers);

// Wishlist routes - protected (users can manage their own wishlist)
router.get("/wishlist", verifyToken, getWishlist);
router.post("/wishlist", verifyToken, addToWishlist);
router.delete("/wishlist/:bookId", verifyToken, removeFromWishlist);

// Protected routes - only admins can modify
router.post("/", requireAdmin, userController.registerUser);
router.put("/:id", requireAdmin, userController.updateUser);
router.delete("/:id", requireAdmin, userController.deleteUser);

export default router;
