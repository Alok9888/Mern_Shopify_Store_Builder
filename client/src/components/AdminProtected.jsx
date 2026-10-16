import { useContext } from "react"
import { Navigate } from "react-router-dom"
import { AuthContext } from "../context/AuthContext.jsx"

export default function AdminProtected({children}){
  const {token} = useContext(AuthContext)
  console.log("PROTECTED CHECK TOKEN:", token)
  if(!token) return <Navigate to="/admin" replace />
  return children
}