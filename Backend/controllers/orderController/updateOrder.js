import  Order  from "../../models/orderModel.js";

const updateOrder = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: "Invalid order ID" });
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!updatedOrder) return res.status(404).json({ message: "Order not found" });

    res.status(200).json({
      message: "✅ Order updated successfully",
      order: updatedOrder,
    });
  } catch (error) {
    console.error("❌ Update Order Error:", error);
    res.status(500).json({ message: "Error updating order" });
  }
};

export default updateOrder;
