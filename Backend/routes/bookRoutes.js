import express from "express";
import addBook from "../controllers/bookController/addBook.js";
import getBooks from "../controllers/bookController/getBooks.js";
import updateBook from "../controllers/bookController/updateBook.js";
import deleteBook from "../controllers/bookController/deleteBook.js";
import { verifyToken, requireAdmin } from "../middleware/auth.js";

const router = express.Router();

// Public route - anyone can view books
router.get("/", getBooks);

// Protected routes - only admins can modify
// TEMPORARY: Remove requireAdmin for testing
router.post("/", addBook); // TODO: Add requireAdmin back before production
router.put("/:id", requireAdmin, updateBook);
router.delete("/:id", requireAdmin, deleteBook);

export default router;
