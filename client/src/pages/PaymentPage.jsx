import { useState } from "react"
import { useNavigate } from "react-router-dom"

export default function PaymentPage({ cart, clearCart }){
  const navigate = useNavigate()
  const shipping = JSON.parse(localStorage.getItem("shippingInfo") || "{}")
  const total = cart.reduce((s,i)=>s+i.price*i.qty,0)
  const [method, setMethod] = useState("cod")

  const pay = async ()=>{
  const shipping = JSON.parse(localStorage.getItem("shippingInfo") || "{}")
  
  if(method==="cod"){
    await fetch("http://localhost:5000/api/payment/cod",{
      method:"POST", headers:{"Content-Type":"application/json"},
      body: JSON.stringify({ items: cart, total, customer: shipping })
    })
    clearCart()
    navigate("/order-success")
    return
  }

  // ONLINE - create razorpay order from backend
  console.log("Creating razorpay order...")
  const res = await fetch("http://localhost:5000/api/payment/create-order",{
    method:"POST", headers:{"Content-Type":"application/json"},
    body: JSON.stringify({ total, customer: shipping, items: cart })
  })
  const data = await res.json()
  console.log("Backend returned:", data)

  if(!window.Razorpay){
    alert("Razorpay script not loaded - check index.html")
    return
  }

  const options = {
    key: data.key,
    amount: data.amount,
    currency: "INR",
    order_id: data.orderId,
    name: "ITGEEKS Store",
    description: "Order Payment",
    handler: async function(response){
      console.log("Razorpay response:", response)
      const verifyRes = await fetch("http://localhost:5000/api/payment/verify",{
        method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify(response)
      })
      const verifyData = await verifyRes.json()
      if(verifyData.success){
        clearCart()
        localStorage.removeItem("shippingInfo")
        navigate("/order-success")
      } else {
        alert("Payment verification failed")
      }
    },
    prefill: shipping,
    theme: { color: "#000" }
  }

  const rzp = new window.Razorpay(options)
  rzp.open()
}

  return (
    <div className="min-h-screen bg-gray-50 p-6 flex justify-center">
      <div className="w-full max-w-4xl grid md:grid-cols-[1.6fr_1fr] gap-6">
        <div className="bg-white border rounded- p-6 h-fit">
          <h2 className="text-xl font-bold mb-5">Choose Payment</h2>
          <div className="space-y-3">
            <label className={`flex items-center gap-3 border rounded-xl p-4 cursor-pointer ${method==='cod'?'border-black':''}`}>
              <input type="radio" checked={method==='cod'} onChange={()=>setMethod('cod')} />
              <span className="text-sm font-medium">Cash on Delivery</span>
            </label>
            <label className={`flex items-center gap-3 border rounded-xl p-4 cursor-pointer ${method==='online'?'border-black':''}`}>
              <input type="radio" checked={method==='online'} onChange={()=>setMethod('online')} />
              <span className="text-sm font-medium">Pay Online (UPI / Card) - Mock</span>
            </label>
          </div>
          <button onClick={pay} className="w-full h-11 bg-black text-white rounded-xl font-semibold mt-6">
            {method==='cod'? `Place Order ₹${total}` : `Pay ₹${total}`}
          </button>
        </div>
        <div className="bg-white border rounded- p-6 h-fit">
          <h3 className="font-bold mb-3">Summary</h3>
          {cart.map(i=><div key={i._id} className="flex justify-between text-sm py-1"><span>{i.name} x{i.qty}</span><span>₹{i.price*i.qty}</span></div>)}
          <div className="border-t mt-3 pt-3 flex justify-between font-bold"><span>Total</span><span>₹{total}</span></div>
          <p className="text-xs text-zinc-500 mt-3">Ship to: {shipping.address}, {shipping.city}</p>
        </div>
      </div>
    </div>
  )
}