import User from "../../models/userModel.js";

// Add book to wishlist
export const addToWishlist = async (req, res) => {
  try {
    const { bookId } = req.body;
    const userId = req.user.userId;

    console.log('📖 Adding to wishlist. User:', userId, 'Book:', bookId);

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if book already in wishlist
    if (user.wishlist.includes(bookId)) {
      return res.status(400).json({ message: "Book already in wishlist" });
    }

    user.wishlist.push(bookId);
    await user.save();

    console.log('✅ Book added to wishlist');
    res.status(200).json({ 
      message: "Book added to wishlist", 
      wishlist: user.wishlist 
    });
  } catch (error) {
    console.error('❌ Error adding to wishlist:', error);
    res.status(500).json({ message: "Failed to add book to wishlist" });
  }
};

// Remove book from wishlist
export const removeFromWishlist = async (req, res) => {
  try {
    const { bookId } = req.params;
    const userId = req.user.userId;

    console.log('🗑️ Removing from wishlist. User:', userId, 'Book:', bookId);

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.wishlist = user.wishlist.filter(id => id.toString() !== bookId);
    await user.save();

    console.log('✅ Book removed from wishlist');
    res.status(200).json({ 
      message: "Book removed from wishlist", 
      wishlist: user.wishlist 
    });
  } catch (error) {
    console.error('❌ Error removing from wishlist:', error);
    res.status(500).json({ message: "Failed to remove book from wishlist" });
  }
};

// Get user's wishlist
export const getWishlist = async (req, res) => {
  try {
    const userId = req.user.userId;

    console.log('📚 Getting wishlist for user:', userId);

    const user = await User.findById(userId).populate('wishlist');
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ wishlist: user.wishlist });
  } catch (error) {
    console.error('❌ Error getting wishlist:', error);
    res.status(500).json({ message: "Failed to get wishlist" });
  }
};
