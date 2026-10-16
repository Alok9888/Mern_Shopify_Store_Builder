import { useState } from "react"
import { useNavigate } from "react-router-dom"

export default function CheckoutPage() {
  const [form, setForm] = useState({ name: "", email: "", phone: "" })
  const [errors, setErrors] = useState({})
  const navigate = useNavigate()

  const validate = () => {
    const e = {}

    if (!form.name.trim()) e.name = "Name is required"
    else if (form.name.trim().length < 3) e.name = "Enter at least 3 characters"
    else if (!/^[A-Za-z\s]+$/.test(form.name.trim())) e.name = "Use letters and spaces only"

    if (!form.email.trim()) e.email = "Email is required"
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      e.email = "Enter a valid email address"
    }

    if (!form.phone.trim()) e.phone = "Phone is required"
    else if (!/^\d{10}$/.test(form.phone.trim())) e.phone = "Enter a 10-digit phone number"

    setErrors(e)
    return Object.keys(e).length === 0
  }

  const submit = (e) => {
    e.preventDefault()
    if (!validate()) return

    localStorage.setItem("shippingInfo", JSON.stringify(form))
    navigate("/payment")
  }

  const inputClass = (field) =>
    `w-full rounded-xl border bg-white px-4 py-3 text-sm font-medium text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-violet-400 focus:ring-4 focus:ring-violet-100 ${
      errors[field] ? "border-red-400 focus:border-red-400 focus:ring-red-100" : "border-violet-100"
    }`

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-fuchsia-50 px-4 py-12 md:py-16">
      <div className="mx-auto max-w-md">
        <div className="mb-6">
          <span className="inline-flex rounded-full bg-violet-100 px-3 py-1 text-xs font-extrabold uppercase tracking-widest text-violet-700">
            Checkout
          </span>
          <h1 className="mt-3 text-3xl font-black tracking-tight text-slate-900">
            Delivery details
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Enter your contact information to continue.
          </p>
        </div>

        <form
          onSubmit={submit}
          className="grid gap-5 rounded-3xl border border-violet-100 bg-white p-6 shadow-xl shadow-violet-100/60 md:p-8"
        >
          <div>
            <label htmlFor="name" className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-600">
              Full name
            </label>
            <input
              id="name"
              type="text"
              autoComplete="name"
              placeholder="e.g. Alex Morgan"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className={inputClass("name")}
            />
            {errors.name && <p className="mt-1.5 text-xs font-medium text-red-600">{errors.name}</p>}
          </div>

          <div>
            <label htmlFor="email" className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-600">
              Email address
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className={inputClass("email")}
            />
            {errors.email && <p className="mt-1.5 text-xs font-medium text-red-600">{errors.email}</p>}
          </div>

          <div>
            <label htmlFor="phone" className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-600">
              Phone number
            </label>
            <input
              id="phone"
              type="tel"
              inputMode="numeric"
              autoComplete="tel"
              placeholder="10-digit phone number"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className={inputClass("phone")}
            />
            {errors.phone && <p className="mt-1.5 text-xs font-medium text-red-600">{errors.phone}</p>}
          </div>

          <button
            type="submit"
            className="mt-1 rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-600 py-3.5 text-sm font-extrabold text-white shadow-lg shadow-violet-200 transition hover:from-violet-700 hover:to-fuchsia-700 hover:shadow-xl active:scale-[0.98]"
          >
            Continue to payment <span className="ml-1">→</span>
          </button>
        </form>
      </div>
    </div>
  )
}