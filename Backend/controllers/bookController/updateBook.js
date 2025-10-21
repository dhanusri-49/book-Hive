import { Book } from "../../models/bookModel.js";

const updateBook = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate MongoDB ObjectId
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: "Invalid book ID" });
    }

    // Only update fields provided in req.body
    const updatedBook = await Book.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true, runValidators: true } // return updated doc and validate schema
    );

    if (!updatedBook) return res.status(404).json({ message: "Book not found" });

    res.status(200).json({
      message: "✅ Book updated successfully",
      book: updatedBook,
    });
  } catch (error) {
    console.error("❌ Update Book Error:", error);
    res.status(500).json({ message: "Error updating book" });
  }
};

export default updateBook;
