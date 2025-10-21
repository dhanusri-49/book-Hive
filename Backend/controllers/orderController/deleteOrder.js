import  Order  from "../../models/orderModel.js";

const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: "Invalid order ID" });
    }

    const deletedOrder = await Order.findByIdAndDelete(id);

    if (!deletedOrder) return res.status(404).json({ message: "Order not found" });

    res.status(200).json({ message: "✅ Order deleted successfully" });
  } catch (error) {
    console.error("❌ Delete Order Error:", error);
    res.status(500).json({ message: "Error deleting order" });
  }
};

export default deleteOrder;
