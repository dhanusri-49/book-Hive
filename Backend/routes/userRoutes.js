import express from "express";
import userController from "../controllers/userController.js";

const router = express.Router();

router.post("/", userController.registerUser);      // Register a new user
router.get("/", userController.getUsers);           // Get all users
router.put("/:id", userController.updateUser);      // Update user by ID
router.delete("/:id", userController.deleteUser);   // Delete user by ID

export default router;
