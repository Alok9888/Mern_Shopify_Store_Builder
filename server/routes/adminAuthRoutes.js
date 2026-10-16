import express from "express"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import Admin from "../models/Admin.js"
const router = express.Router()

router.post("/login", async (req,res)=>{
  const {email,password} = req.body
  const admin = await Admin.findOne({email})
  if(!admin) return res.status(400).json({message:"Invalid credentials"})
  const ok = await bcrypt.compare(password, admin.password)
  if(!ok) return res.status(400).json({message:"Invalid credentials"})
  const token = jwt.sign({id: admin._id, role:"admin"}, process.env.JWT_SECRET, {expiresIn:"1h"})
  res.json({token, email: admin.email})
})
export default router