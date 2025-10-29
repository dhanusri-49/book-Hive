import express from "express";
import login from "../controllers/authController/login.js";
import register from "../controllers/authController/register.js";

const router = express.Router();

// Public routes
router.post("/login", login);
router.post("/register", register);

export default router;
