import express from "express";
import addBook from "../controllers/bookController/addBook.js";
import getBooks from "../controllers/bookController/getBooks.js";
import updateBook from "../controllers/bookController/updateBook.js";
import deleteBook from "../controllers/bookController/deleteBook.js";

const router = express.Router();

// Add a new book
router.post("/", addBook);

// Get all books
router.get("/", getBooks);

// Update a book by ID
router.put("/:id", updateBook);

// Delete a book by ID
router.delete("/:id", deleteBook);

export default router;
