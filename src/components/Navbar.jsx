export default function Navbar({ cartCount = 0 }) {
  return (
    <nav className="bg-[#FCF9F6]/80 backdrop-blur-xl border-b border-[#E8E0D9] sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-[#FF4D00] text-white flex items-center justify-center rounded-full font-black text-sm">I</div>
          <span className="font-black text- tracking-tighter">ITGEEKS<span className="font-normal text-[#8A7F7A]"> STORE</span></span>
          <span className="text- bg-[#1A1A1A] text-white px-2.5 py-1 rounded-full ml-2 tracking-widest uppercase">Mern</span>
        </div>
        <div className="flex gap-3 items-center">
          <div className="text-sm">
            <span className="bg-[#1A1A1A] text-white px-4 py-2 rounded-full text-xs font-medium">Cart • {cartCount}</span>
          </div>
          <button className="bg-[#FF4D00] text-white px-5 py-2 rounded-full text-xs font-bold hover:bg-[#E64400] transition">
            Admin
          </button>
        </div>
      </div>
    </nav>
  )
}