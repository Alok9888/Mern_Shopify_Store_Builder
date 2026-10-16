import { useState, useContext } from "react"
import { useNavigate } from "react-router-dom"
import { AuthContext } from "../context/AuthContext.jsx"

export default function AdminPage({ products, refresh }) {
  const { token, email, setToken, setEmail } = useContext(AuthContext)
  const navigate = useNavigate()

  const [form, setForm] = useState({
    name: "", price: "", category: "", emoji: "", description: "",
  })

  const handleLogout = () => {
    setToken(null)
    setEmail(null)
    navigate("/admin") // goes to login
  }

  const handleAdd = async (e) => {
    e.preventDefault()
    await fetch("http://localhost:5000/api/products", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}` 
      },
      body: JSON.stringify({ ...form, price: Number(form.price) }),
    })
    setForm({ name: "", price: "", category: "", emoji: "", description: "" })
    refresh()
  }

  const handleDelete = async (id) => {
    await fetch(`http://localhost:5000/api/products/${id}`, {
      method: "DELETE",
      headers: { "Authorization": `Bearer ${token}` }
    })
    refresh()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
          <h1 className="text-xl font-bold">Admin Panel</h1>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600 bg-gray-100 px-3 py-1.5 rounded-full">
              {email}
            </span>
            <button
              onClick={handleLogout}
              className="text-sm bg-red-500 hover:bg-red-600 text-white px-4 py-1.5 rounded-lg font-medium"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-6">Add Service</h2>
        <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-6 border rounded-2xl shadow-sm mb-10">
          <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Service Name" className="border px-4 py-2.5 rounded-xl text-sm" required />
          <input value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="Price" type="number" className="border px-4 py-2.5 rounded-xl text-sm" required />
          <input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="Category" className="border px-4 py-2.5 rounded-xl text-sm" required />
          <input value={form.emoji} onChange={(e) => setForm({ ...form, emoji: e.target.value })} placeholder="Emoji" className="border px-4 py-2.5 rounded-xl text-sm" required />
          <input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Description" className="md:col-span-2 border px-4 py-2.5 rounded-xl text-sm" required />
          <button className="md:col-span-2 bg-black text-white py-3 rounded-xl">+ Add Product</button>
        </form>

        <div className="bg-white border rounded-2xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b font-semibold">All Services ({products.length})</div>
          <div className="divide-y">
            {products.map((p) => (
              <div key={p._id} className="flex justify-between items-center p-4">
                <span>{p.emoji} {p.name} — ₹{p.price}</span>
                <button onClick={() => handleDelete(p._id)} className="text-xs bg-red-50 text-red-600 px-3 py-1.5 rounded-lg">Delete</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}