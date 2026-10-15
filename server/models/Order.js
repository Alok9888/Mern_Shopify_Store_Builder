import mongoose from "mongoose"

const orderSchema = new mongoose.Schema({
  items: [
    {
      name: String,
      price: Number,
      qty: Number,
      productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" }
    }
  ],
  total: Number,
  customer: {
    name: String,
    email: String,
  }
}, { timestamps: true })

export default mongoose.model("Order", orderSchema)