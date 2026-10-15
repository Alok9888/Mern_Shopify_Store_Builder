import { useState } from "react"
export default function AdminPage({ products, refresh }) {
  const [form, setForm] = useState({ name: "", price: "", category: "", emoji: "", description: "" })

  const handleAdd = async (e) => {
    e.preventDefault()
    await fetch("http://localhost:5000/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, price: Number(form.price) })
    })
    setForm({ name: "", price: "", category: "", emoji: "", description: "" })
    refresh() // instead of local fetch
  }

  const handleDelete = async (id) => {
    await fetch(`http://localhost:5000/api/products/${id}`, { method: "DELETE" })
    refresh()
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Admin - Add Service</h1>

      <form onSubmit={handleAdd} className="grid grid-cols-2 gap-3 bg-white p-4 border rounded-xl mb-8">
        <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="Name" className="border px-3 py-2 rounded text-sm" required />
        <input value={form.price} onChange={e => setForm({...form, price: e.target.value})} placeholder="Price" type="number" className="border px-3 py-2 rounded text-sm" required />
        <input value={form.category} onChange={e => setForm({...form, category: e.target.value})} placeholder="Category" className="border px-3 py-2 rounded text-sm" required />
        <input value={form.emoji} onChange={e => setForm({...form, emoji: e.target.value})} placeholder="Emoji" className="border px-3 py-2 rounded text-sm" required />
        <input value={form.description} onChange={e => setForm({...form, description: e.target.value})} placeholder="Description" className="col-span-2 border px-3 py-2 rounded text-sm" required />
        <button className="col-span-2 bg-black text-white py-2 rounded text-sm">Add Product</button>
      </form>

      <div className="grid gap-2">
        {products.map(p => (
          <div key={p._id} className="flex justify-between items-center bg-white border p-3 rounded text-sm">
            <span>{p.emoji} {p.name} - ₹{p.price}</span>
            <button onClick={() => handleDelete(p._id)} className="text-red-500">Delete</button>
          </div>
        ))}
      </div>
    </div>
  )
}