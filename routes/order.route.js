import express from "express";
import { confirm, getOrders, intent } from "../controllers/order.controller.js";
import { verifyToken } from "../middleware/jwt.js";
const router = express.Router();

// router.post("/:gigId", verifyToken, createOrder);
router.get("/", getOrders);
router.post("/create-payment-intent/:id", intent);
router.put("/", confirm);

export default router;
