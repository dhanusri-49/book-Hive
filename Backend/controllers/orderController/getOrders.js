import Order from "../../models/orderModel.js";

const getOrders = async (req, res) => {
  try {
    console.log('📦 Fetching all orders...');
    const orders = await Order.find()
      .populate("user", "name email") // Only populate specific user fields
      .populate("books.book", "title author price genre") // Populate book details
      .sort({ createdAt: -1 }); // Sort by newest first
    
    console.log(`✅ Found ${orders.length} orders`);
    
    // Format the response to make it more readable
    const formattedOrders = orders.map(order => ({
      _id: order._id,
      user: order.user,
      books: order.books.map(bookOrder => ({
        book: bookOrder.book,
        quantity: bookOrder.quantity,
        subtotal: bookOrder.book ? bookOrder.book.price * bookOrder.quantity : 0
      })),
      totalPrice: order.totalPrice,
      status: order.status,
      orderDate: order.orderDate,
      deliveryDate: order.deliveryDate,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt
    }));
    
    // Return the orders array directly for frontend compatibility
    res.status(200).json(formattedOrders);
  } catch (error) {
    console.error("❌ Get Orders Error:", error);
    console.error("Error details:", error.message);
    res.status(500).json({ message: error.message });
  }
};

export default getOrders;
