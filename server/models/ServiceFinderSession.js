import mongoose from "mongoose"

const serviceFinderSessionSchema = new mongoose.Schema({
  need: { type: String, required: true, maxlength: 500 },
  recommendations: [{
    productId: { type: String, required: true },
    name: { type: String, required: true, maxlength: 160 },
  }],
  helpful: { type: Boolean, default: null },
  feedbackAt: { type: Date, default: null },
}, { timestamps: true })

export default mongoose.model("ServiceFinderSession", serviceFinderSessionSchema)
