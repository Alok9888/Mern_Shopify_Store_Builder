import { Link } from "react-router-dom"

export default function Navbar({ cartCount }) {
  return (
    <div className="sticky top-0 z-10 bg-white border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="font-bold tracking-tight">Shopify.</Link>
        <div className="flex items-center gap-3">
          <Link to="/cart" className="text-sm bg-gray-100 px-3 py-1.5 rounded-lg">
            Cart {cartCount}
          </Link>
          <Link to="/admin" className="text-sm bg-black text-white px-3 py-1.5 rounded-lg">
            Admin
          </Link>
        </div>
      </div>
    </div>
  )
}