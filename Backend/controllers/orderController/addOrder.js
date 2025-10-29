import Order from "../../models/orderModel.js";
import { Book } from "../../models/bookModel.js";

const addOrder = async (req, res) => {
  try {
    console.log('🛍️ Creating order. User:', req.user);
    console.log('📦 Order data:', req.body);
    
    // Get user from JWT token (for regular users) or from request body (for admins)
    const userId = req.body.user || req.user.userId;
    const { books } = req.body;
    
    if (!userId || !books || !Array.isArray(books) || books.length === 0) {
      return res.status(400).json({ message: "Books array is required" });
    }

    let totalPrice = 0;
    const processedBooks = [];

    // Process each book in the order
    for (const bookOrder of books) {
      const { book: bookId, quantity } = bookOrder;
      
      if (!bookId || !quantity || quantity <= 0) {
        return res.status(400).json({ message: "Invalid book data" });
      }

      // Find the book and check stock
      const book = await Book.findById(bookId);
      if (!book) {
        return res.status(404).json({ message: `Book with ID ${bookId} not found` });
      }

      if (book.stock < quantity) {
        return res.status(400).json({ 
          message: `Insufficient stock for book "${book.title}". Available: ${book.stock}, Requested: ${quantity}` 
        });
      }

      // Calculate price for this book
      const bookTotal = book.price * quantity;
      totalPrice += bookTotal;

      // Add to processed books array
      processedBooks.push({
        book: bookId,
        quantity: quantity
      });

      // Update book stock
      book.stock -= quantity;
      await book.save();
    }

    // Create the order
    const newOrder = new Order({
      user: userId,
      books: processedBooks,
      totalPrice,
      status: "pending"
    });

    const savedOrder = await newOrder.save();

    // Populate the order with book and user details for response
    const populatedOrder = await Order.findById(savedOrder._id)
      .populate("user", "name email")
      .populate("books.book", "title author price");

    res.status(201).json({
      message: "✅ Order created successfully",
      order: populatedOrder,
    });
  } catch (error) {
    console.error("❌ Add Order Error:", error);
    res.status(400).json({ message: error.message });
  }
};

export default addOrder;
