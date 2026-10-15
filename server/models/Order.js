import mongoose from "mongoose"

const orderSchema = new mongoose.Schema({
  items: [
    {
      productId: String,
      name: String,
      price: Number,
      quantity: Number,
      emoji: String,
    }
  ],
  totalAmount: Number,
  customer: {
    name: String,
    email: String,
    address: String,
    phone: String,
  },
  status: { type: String, default: "Pending" }
}, { timestamps: true })

export default mongoose.model("Order", orderSchema)