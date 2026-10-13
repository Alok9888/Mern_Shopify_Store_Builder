export default function Navbar({ cartCount }) {
  return (
    // simple sticky navbar
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="max-w-6xl mx-auto px-4 py-3.5 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-black text-white rounded-md flex items-center justify-center text-xs font-bold">I</div>
          <span className="font-semibold text-sm">ITGEEKS STORE</span>
        </div>
        <div className="flex items-center gap-3">
          {/* cart count from props */}
          <span className="text-sm bg-gray-100 px-3 py-1.5 rounded-full">Cart {cartCount}</span>
          <button className="text-sm bg-black text-white px-4 py-1.5 rounded-full">Admin</button>
        </div>
      </div>
    </nav>
  )
}