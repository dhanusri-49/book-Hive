import mongoose from "mongoose";

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String },
  description: { type: String },
  stock: { type: Number, default: 0 },
  genre: {
    type: String,
    enum: ["fictional", "non-fictional", "horror", "academic", "self-help"],
    required: true
  }
}, { timestamps: true });

export const Book = mongoose.model("Book", bookSchema);
