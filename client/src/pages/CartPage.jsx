import { Link } from "react-router-dom"

export default function CartPage({ cart, removeFromCart, addToCart, decreaseQty }) {
  const total = cart.reduce((sum, p) => sum + (p.price * p.qty), 0)

  if (cart.length === 0) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-16 text-center">
        <div className="text-gray-400">Cart is empty</div>
        <Link to="/" className="text-sm bg-black text-white px-4 py-2 rounded-lg mt-4 inline-block">Go to Store</Link>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold">Cart ({cart.reduce((s, i) => s + i.qty, 0)} items)</h1>

      <div className="mt-6 space-y-3">
        {cart.map((p) => (
          <div key={p._id} className="bg-white border border-gray-200 rounded-lg p-4 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <span className="text-xl">{p.emoji}</span>
              <div>
                <div className="text-sm font-medium">{p.name}</div>
                <div className="text-xs text-gray-500">₹{p.price} x {p.qty}</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => decreaseQty(p._id)} className="w-7 h-7 bg-gray-100 rounded text-sm">-</button>
              <span className="text-sm w-4 text-center">{p.qty}</span>
              <button onClick={() => addToCart(p)} className="w-7 h-7 bg-gray-100 rounded text-sm">+</button>
              <span className="text-sm font-semibold ml-3">₹{p.price * p.qty}</span>
              <button onClick={() => removeFromCart(p._id)} className="text-xs text-red-500 ml-3">Remove</button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 bg-white border border-gray-200 rounded-lg p-4 flex justify-between items-center">
        <div className="font-bold">Total: ₹{total}</div>
        <button className="bg-black text-white px-5 py-2 rounded-lg text-sm">Checkout</button>
      </div>
    </div>
  )
}