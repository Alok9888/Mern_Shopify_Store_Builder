import dotenv from "dotenv"
dotenv.config()
import express from "express"
import mongoose from "mongoose"
import cors from "cors"
import productRoutes from "./routes/productRoutes.js"
import orderRoutes from "./routes/orderRoutes.js"
import Product from "./models/Product.js"
import adminAuthRoutes from "./routes/adminAuthRoutes.js"
import paymentRoutes from "./routes/paymentRoutes.js"

const app = express()

app.use(cors())
app.use(express.json())
app.use("/api/payment", paymentRoutes)

// routes
app.use("/api/products", productRoutes)
app.use("/api/orders", orderRoutes)
app.use("/api/admin-auth", adminAuthRoutes)


app.get("/", (req, res) => res.send("api running"))

// seed - keep here for one-time use
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

mongoose.connect(process.env.MONGO_URI)
  .then(() => app.listen(5000, () => console.log("Server on 5000")))
