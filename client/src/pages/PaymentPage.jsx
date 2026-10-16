import { useState } from "react"
import { useNavigate } from "react-router-dom"

export default function PaymentPage({ cart, clearCart }) {
  const navigate = useNavigate()
  const shipping = JSON.parse(localStorage.getItem("shippingInfo") || "{}")
  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0)
  const [method, setMethod] = useState("cod")
  const [processing, setProcessing] = useState(false)

  const pay = async () => {
    if (processing) return

    if (!cart.length) {
      alert("Your cart is empty.")
      return
    }

    setProcessing(true)

    try {
      if (method === "cod") {
        const res = await fetch("http://localhost:5000/api/payment/cod", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ items: cart, total, customer: shipping }),
        })

        const data = await res.json()

        if (!res.ok) {
          throw new Error(data.message || "Could not place your order")
        }

        clearCart()
        localStorage.removeItem("shippingInfo")
        navigate("/order-success")
        return
      }

      const res = await fetch("http://localhost:5000/api/payment/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ total, customer: shipping, items: cart }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.message || "Could not create payment order")
      }

      if (!window.Razorpay) {
        throw new Error("Razorpay script not loaded. Check that it is included in index.html.")
      }

      const options = {
        key: data.key,
        amount: data.amount,
        currency: data.currency || "INR",
        order_id: data.orderId,
        name: "ITGEEKS Store",
        description: "Order Payment",
        handler: async (response) => {
          try {
            const verifyRes = await fetch("http://localhost:5000/api/payment/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(response),
            })

            const verifyData = await verifyRes.json()

            if (!verifyRes.ok || !verifyData.success) {
              throw new Error(verifyData.message || "Payment verification failed")
            }

            clearCart()
            localStorage.removeItem("shippingInfo")
            navigate("/order-success")
          } catch (error) {
            alert(error.message || "Could not verify payment")
          }
        },
        prefill: {
          name: shipping.name || "",
          email: shipping.email || "",
          contact: shipping.phone || "",
        },
        theme: { color: "#7c3aed" },
        modal: {
          ondismiss: () => setProcessing(false),
        },
      }

      const razorpay = new window.Razorpay(options)

      razorpay.on("payment.failed", (response) => {
        setProcessing(false)
        alert(response.error?.description || "Payment failed. Please try again.")
      })

      razorpay.open()
    } catch (error) {
      console.error("Payment error:", error)
      alert(error.message || "Something went wrong while processing your order")
      setProcessing(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-fuchsia-50 px-6 py-10 md:py-14">
      <div className="mx-auto grid w-full max-w-6xl gap-6 md:grid-cols-[1.5fr_1fr]">
        <div className="h-fit rounded-3xl border border-violet-100 bg-white p-6 shadow-xl shadow-violet-100/60 md:p-8">
          <span className="inline-flex rounded-full bg-violet-100 px-3 py-1 text-xs font-extrabold uppercase tracking-widest text-violet-700">
            Checkout
          </span>
          <h2 className="mb-6 mt-3 text-2xl font-black tracking-tight text-slate-900">
            Choose payment
          </h2>

          <div className="space-y-3">
            <label
              className={`flex cursor-pointer items-center gap-4 rounded-2xl border p-4 transition ${
                method === "cod"
                  ? "border-violet-400 bg-violet-50 ring-4 ring-violet-100"
                  : "border-slate-200 hover:border-violet-200 hover:bg-slate-50"
              }`}
            >
              <input
                type="radio"
                name="payment"
                value="cod"
                checked={method === "cod"}
                onChange={() => setMethod("cod")}
                className="h-4 w-4 accent-violet-600"
              />
              <span>
                <span className="block text-sm font-extrabold text-slate-900">
                  Cash on Delivery
                </span>
                <span className="mt-0.5 block text-xs text-slate-500">
                  Pay when your order arrives
                </span>
              </span>
            </label>

            <label
              className={`flex cursor-pointer items-center gap-4 rounded-2xl border p-4 transition ${
                method === "online"
                  ? "border-violet-400 bg-violet-50 ring-4 ring-violet-100"
                  : "border-slate-200 hover:border-violet-200 hover:bg-slate-50"
              }`}
            >
              <input
                type="radio"
                name="payment"
                value="online"
                checked={method === "online"}
                onChange={() => setMethod("online")}
                className="h-4 w-4 accent-violet-600"
              />
              <span>
                <span className="block text-sm font-extrabold text-slate-900">
                  Pay Online
                </span>
                <span className="mt-0.5 block text-xs text-slate-500">
                  UPI, cards, and other Razorpay options
                </span>
              </span>
            </label>
          </div>

          <button
            onClick={pay}
            disabled={processing || cart.length === 0}
            className="mt-6 h-12 w-full rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-600 font-extrabold text-white shadow-lg shadow-violet-200 transition hover:from-violet-700 hover:to-fuchsia-700 hover:shadow-xl active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {processing
              ? "Processing..."
              : method === "cod"
                ? `Place Order · ₹${total}`
                : `Pay Now · ₹${total}`}
          </button>
        </div>

        <div className="h-fit rounded-3xl border border-violet-100 bg-white p-6 shadow-xl shadow-violet-100/60 md:p-8">
          <h3 className="mb-5 text-lg font-black tracking-tight text-slate-900">
            Order summary
          </h3>

          {cart.length === 0 ? (
            <p className="text-sm text-slate-500">Your cart is empty.</p>
          ) : (
            <div className="space-y-3">
              {cart.map(item => (
                <div
                  key={item._id}
                  className="flex justify-between gap-4 text-sm"
                >
                  <span className="font-medium text-slate-600">
                    {item.name} <span className="text-slate-400">× {item.qty}</span>
                  </span>
                  <span className="shrink-0 font-bold text-slate-900">
                    ₹{item.price * item.qty}
                  </span>
                </div>
              ))}
            </div>
          )}

          <div className="mt-5 flex justify-between border-t border-violet-100 pt-4 text-base font-black text-slate-900">
            <span>Total</span>
            <span>₹{total}</span>
          </div>

          <div className="mt-5 rounded-2xl bg-violet-50 p-4">
            <p className="text-xs font-bold uppercase tracking-wider text-violet-700">
              Delivering to
            </p>
            <p className="mt-1 text-sm font-semibold text-slate-700">
              {[shipping.address, shipping.city].filter(Boolean).join(", ") || "Address not provided"}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}