import { useState } from "react"
import { useNavigate } from "react-router-dom"

export default function CheckoutPage(){
  const [form, setForm] = useState({ name:"", email:"", phone:"" })
  const [errors, setErrors] = useState({})
  const navigate = useNavigate()

  const validate = () => {
    const e = {}
    // Name: min 3 chars, only letters + space
    if(!form.name.trim()) e.name = "Name is required"
    else if(form.name.trim().length < 3) e.name = "Min 3 characters"
    else if(!/^[A-Za-z\s]+$/.test(form.name)) e.name = "Only letters allowed"

    // Email: proper format
    if(!form.email.trim()) e.email = "Email is required"
    else if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Invalid email format"

    // Phone: 10 digits
    if(!form.phone.trim()) e.phone = "Phone is required"
    else if(!/^\d{10}$/.test(form.phone)) e.phone = "Enter 10 digit number"

    setErrors(e)
    return Object.keys(e).length === 0
  }

  const submit = (e)=>{
    e.preventDefault()
    if(!validate()) return
    localStorage.setItem("shippingInfo", JSON.stringify(form))
    navigate("/payment")
  }

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>
      <form onSubmit={submit} className="grid gap-4 bg-white p-5 border rounded-2xl">
        <div>
          <input placeholder="Full Name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} className={`w-full border px-3 py-2.5 rounded-xl text-sm ${errors.name?'border-red-500':''}`} />
          {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
        </div>
        <div>
          <input placeholder="Email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} className={`w-full border px-3 py-2.5 rounded-xl text-sm ${errors.email?'border-red-500':''}`} />
          {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
        </div>
        <div>
          <input placeholder="Phone" value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})} className={`w-full border px-3 py-2.5 rounded-xl text-sm ${errors.phone?'border-red-500':''}`} />
          {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
        </div>
        <button className="bg-black text-white py-3 rounded-xl text-sm font-semibold">Continue to Payment</button>
      </form>
    </div>
  )
}