import  Order  from "../../models/orderModel.js";

const addOrder = async (req, res) => {
  try {
    const newOrder = new Order(req.body);
    const savedOrder = await newOrder.save();

    res.status(201).json({
      message: "✅ Order created successfully",
      order: savedOrder,
    });
  } catch (error) {
    console.error("❌ Add Order Error:", error);
    res.status(400).json({ message: error.message });
  }
};

export default addOrder;
