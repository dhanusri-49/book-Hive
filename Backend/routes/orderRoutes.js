import express from "express";
import addOrder from "../controllers/orderController/addOrder.js";
import getOrders from "../controllers/orderController/getOrders.js";
import updateOrder from "../controllers/orderController/updateOrder.js";
import deleteOrder from "../controllers/orderController/deleteOrder.js";

const router = express.Router();

router.post("/", addOrder);
router.get("/", getOrders);
router.put("/:id", updateOrder);
router.delete("/:id", deleteOrder);

export default router;
