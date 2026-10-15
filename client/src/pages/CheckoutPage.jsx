import { useState } from "react"

export default function CheckoutPage({ cart, clearCart }) {
  const [form, setForm] = useState({ name: "", email: "", address: "", phone: "" })
  const [done, setDone] = useState(false)

  const total = cart.reduce((s, i) => s + i.price * i.quantity, 0)

  const handleSubmit = async (e) => {
    e.preventDefault()
    await fetch("http://localhost:5000/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        items: cart,
        totalAmount: total,
        customer: form
      })
    })
    clearCart()
    setDone(true)
  }

  if (done) return <div className="max-w-xl mx-auto p-8 text-center"><h1 className="text-2xl font-bold">Order Placed! ✅</h1><p>We will contact you soon.</p></div>

  return (
    <div className="max-w-xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Checkout - ₹{total}</h1>
      <form onSubmit={handleSubmit} className="grid gap-3 bg-white p-4 border rounded-xl">
        <input placeholder="Name" className="border px-3 py-2 rounded text-sm" required value={form.name} onChange={e=>setForm({...form,name:e.target.value})} />
        <input placeholder="Email" className="border px-3 py-2 rounded text-sm" required value={form.email} onChange={e=>setForm({...form,email:e.target.value})} />
        <input placeholder="Phone" className="border px-3 py-2 rounded text-sm" required value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})} />
        <input placeholder="Address" className="border px-3 py-2 rounded text-sm" required value={form.address} onChange={e=>setForm({...form,address:e.target.value})} />
        <button className="bg-black text-white py-2 rounded text-sm">Place Order</button>
      </form>
    </div>
  )
}