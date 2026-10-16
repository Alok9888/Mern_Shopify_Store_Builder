import express from "express";
import Razorpay from "razorpay";
import crypto from "node:crypto";
import dotenv from "dotenv";
import Order from "../models/Order.js";

dotenv.config();

const router = express.Router();

const { RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET } = process.env;

if (!RAZORPAY_KEY_ID || !RAZORPAY_KEY_SECRET) {
  throw new Error("Missing RAZORPAY_KEY_ID or RAZORPAY_KEY_SECRET in environment");
}

const razorpay = new Razorpay({
  key_id: RAZORPAY_KEY_ID,
  key_secret: RAZORPAY_KEY_SECRET,
});

function calculateTotal(items) {
  if (!Array.isArray(items) || items.length === 0) {
    throw new Error("Items must be a non-empty array");
  }

  let total = 0;

  for (const item of items) {
    const price = Number(item?.price);
    const quantity = Number(item?.qty ?? item?.quantity ?? 1);

    if (!Number.isFinite(price) || price <= 0) {
      throw new Error("Each item must have a valid positive price");
    }

    if (!Number.isInteger(quantity) || quantity <= 0) {
      throw new Error("Each item must have a positive integer quantity");
    }

    total += price * quantity;
  }

  if (!Number.isFinite(total) || total <= 0) {
    throw new Error("Invalid order total");
  }

  return Math.round(total * 100) / 100;
}

function isValidSignature(expected, received) {
  if (typeof received !== "string" || !/^[a-f0-9]{64}$/i.test(received)) {
    return false;
  }

  const expectedBuffer = Buffer.from(expected, "hex");
  const receivedBuffer = Buffer.from(received, "hex");

  return (
    expectedBuffer.length === receivedBuffer.length &&
    crypto.timingSafeEqual(expectedBuffer, receivedBuffer)
  );
}

router.post("/create-order", async (req, res) => {
  try {
    const { customer, items } = req.body;

    if (!customer || typeof customer !== "object") {
      return res.status(400).json({ message: "A valid customer is required" });
    }

    const totalAmount = calculateTotal(items);
    const amountInPaise = Math.round(totalAmount * 100);

    if (!Number.isSafeInteger(amountInPaise) || amountInPaise <= 0) {
      return res.status(400).json({ message: "Invalid order amount" });
    }

    const razorpayOrder = await razorpay.orders.create({
      amount: amountInPaise,
      currency: "INR",
      receipt: `order_${Date.now()}`,
    });

    await Order.create({
      items,
      totalAmount,
      customer,
      paymentMethod: "online",
      paymentStatus: "pending",
      razorpay_order_id: razorpayOrder.id,
    });

    return res.json({
      orderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      key: RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error("Create order error:", error);
    return res.status(400).json({
      message: error.message || "Could not create order",
    });
  }
});

router.post("/verify", async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    if (
      typeof razorpay_order_id !== "string" ||
      typeof razorpay_payment_id !== "string" ||
      typeof razorpay_signature !== "string"
    ) {
      return res.status(400).json({
        success: false,
        message: "Missing or invalid payment details",
      });
    }

    const expectedSignature = crypto
      .createHmac("sha256", RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (!isValidSignature(expectedSignature, razorpay_signature)) {
      return res.status(400).json({
        success: false,
        message: "Payment signature verification failed",
      });
    }

    const order = await Order.findOneAndUpdate(
      { razorpay_order_id },
      {
        paymentStatus: "paid",
        razorpay_payment_id,
      },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    return res.json({ success: true, order });
  } catch (error) {
    console.error("Payment verification error:", error);
    return res.status(500).json({
      success: false,
      message: "Could not verify payment",
    });
  }
});

router.post("/cod", async (req, res) => {
  try {
    const { items, customer } = req.body;

    if (!customer || typeof customer !== "object") {
      return res.status(400).json({ message: "A valid customer is required" });
    }

    const totalAmount = calculateTotal(items);

    const order = await Order.create({
      items,
      totalAmount,
      customer,
      paymentMethod: "cod",
      paymentStatus: "pending",
    });

    return res.status(201).json(order);
  } catch (error) {
    console.error("COD order error:", error);
    return res.status(400).json({
      message: error.message || "Could not create COD order",
    });
  }
});

export default router;