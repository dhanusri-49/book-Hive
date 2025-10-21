import  Order  from "../../models/orderModel.js";

const getOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate("user").populate("books");
    res.status(200).json(orders);
  } catch (error) {
    console.error("❌ Get Orders Error:", error);
    res.status(500).json({ message: error.message });
  }
};

export default getOrders;
