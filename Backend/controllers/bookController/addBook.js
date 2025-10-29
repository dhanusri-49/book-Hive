import { Book } from "../../models/bookModel.js";

const addBook = async (req, res) => {
  try {
    console.log('📚 Adding new book. User:', req.user);
    console.log('📝 Book data:', req.body);
    
    // Validate required fields
    const { title, author, price, genre } = req.body;
    if (!title || !author || !price || !genre) {
      return res.status(400).json({ 
        message: "Missing required fields: title, author, price, and genre are required" 
      });
    }
    
    const newBook = new Book(req.body);
    const savedBook = await newBook.save();
    
    console.log('✅ Book added successfully:', savedBook._id);
    res.status(201).json({
      message: "Book added successfully",
      book: savedBook
    });
  } catch (error) {
    console.error('❌ Error adding book:', error.message);
    res.status(400).json({ message: error.message });
  }
};

export default addBook;
