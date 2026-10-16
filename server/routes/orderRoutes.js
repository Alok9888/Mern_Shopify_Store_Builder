import express from "express"
import Order from "../models/Order.js"
import adminProtect from "../middleware/adminAuth.js"
const router = express.Router()

router.post("/", async (req, res) => {
  try {
    const order = await Order.create(req.body)
    res.status(201).json(order)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

router.get("/", adminProtect, async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 })
    res.json(orders)
  } catch (err) {
    res.status(500).json({ message: "Could not load orders" })
  }
})

router.patch("/:id/status", adminProtect, async (req, res) => {
  const allowedStatuses = ["new", "processing", "shipped", "completed", "cancelled"]
  const { fulfillmentStatus } = req.body

  if (!allowedStatuses.includes(fulfillmentStatus)) {
    return res.status(400).json({ message: "Invalid fulfillment status" })
  }

  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { fulfillmentStatus },
      { new: true, runValidators: true }
    )

    if (!order) return res.status(404).json({ message: "Order not found" })
    res.json(order)
  } catch (err) {
    if (err.name === "CastError") return res.status(400).json({ message: "Invalid order ID" })
    res.status(500).json({ message: "Could not update order status" })
  }
})

export default router
