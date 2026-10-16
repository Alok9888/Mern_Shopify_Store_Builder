import express from "express"
import Product from "../models/Product.js"
import adminProtect from "../middleware/adminAuth.js"
const router = express.Router()

// PUBLIC
router.get("/", async (req, res) => {
  try {
    const products = await Product.find()
    res.json(products)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
    if (!product) return res.status(404).json({ message: "not found" })
    res.json(product)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// ADMIN ONLY - protected
router.post("/", adminProtect, async (req, res) => {
  try {
    const product = await Product.create(req.body)
    res.status(201).json(product)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

router.put("/:id", adminProtect, async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true })
    res.json(product)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

router.delete("/:id", adminProtect, async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id)
    res.json({ message: "deleted" })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

export default router