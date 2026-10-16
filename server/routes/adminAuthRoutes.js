import express from "express"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import Admin from "../models/Admin.js"
const router = express.Router()

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body

    const admin = await Admin.findOne({ email })
    if (!admin) {
      return res.status(400).json({ message: "Invalid credentials" })
    }

    const validPassword = await bcrypt.compare(password, admin.password)
    if (!validPassword) {
      return res.status(400).json({ message: "Invalid credentials" })
    }

    const token = jwt.sign(
      { id: admin._id, role: "admin" },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    )

    return res.json({ token, email: admin.email })
  } catch (error) {
    console.error("Admin login error:", error)
    return res.status(500).json({ message: "Login failed due to a server error" })
  }
})

export default router