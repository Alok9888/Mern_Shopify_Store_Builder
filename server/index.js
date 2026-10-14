import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import connectDB from "./config/db.js"
import Product from "./models/product.js"

dotenv.config()

const app = express()

app.use(cors())
app.use(express.json())

// db connect
connectDB()

// get all products
// get all products
app.get("/api/products", async (req, res) => {
  try {
    const products = await Product.find()
    res.json(products)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// get one product by id
app.get("/api/products/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
    if (!product) return res.status(404).json({ message: "not found" })
    res.json(product)
  } catch (err) {
    console.log(err.message)
    res.status(500).json({ message: err.message })
  }
})

// seed - run once to add data
app.post("/api/seed", async (req, res) => {
  await Product.deleteMany({})
  const products = await Product.insertMany([
    { name: "Shopify Store Setup", price: 5000, category: "Shopify", emoji: "🛒", description: "Complete Shopify store with theme setup" },
    { name: "WordPress Website", price: 8000, category: "WordPress", emoji: "🌐", description: "Custom WordPress site with Elementor" },
    { name: "Shopify Custom App", price: 15000, category: "Shopify", emoji: "⚙", description: "Custom private app development" },
    { name: "SEO Optimization", price: 3000, category: "Marketing", emoji: "📈", description: "On-page SEO for your store" },
    { name: "Speed Optimization", price: 4000, category: "Shopify", emoji: "⚡", description: "Make your store super fast" },
    { name: "Figma to Shopify", price: 10000, category: "Shopify", emoji: "🎨", description: "Convert Figma design to Shopify" },
    { name: "WordPress Bug Fix", price: 1500, category: "WordPress", emoji: "🐛", description: "Fix any WordPress issue" },
    { name: "Store Migration", price: 7000, category: "Shopify", emoji: "🚚", description: "Migrate to Shopify from any platform" },
  ])
  res.json(products)
})

// test
app.get("/", (req, res) => {
  res.send("api running")
})

app.listen(5000, () => {
  console.log("backend on 5000")
})