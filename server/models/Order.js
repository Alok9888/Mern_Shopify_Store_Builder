import mongoose from "mongoose"
const orderSchema = new mongoose.Schema({
  items: Array,
  totalAmount: Number,
  customer: Object,
  paymentMethod: String, // cod / online
  paymentStatus: { type: String, default: "pending" }, // pending / paid / failed
  fulfillmentStatus: {
    type: String,
    enum: ["new", "processing", "shipped", "completed", "cancelled"],
    default: "new",
  },
  razorpay_order_id: String,
  razorpay_payment_id: String,
}, { timestamps: true })
export default mongoose.model("Order", orderSchema)
