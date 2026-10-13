import { useState, useMemo } from "react"
import Navbar from "./components/Navbar"
import ProductCard from "./components/ProductCard"
import { products as allProducts } from "./data/products"

function App() {
  const [cart, setCart] = useState([])
  const [search, setSearch] = useState("")
  const [category, setCategory] = useState("All")

  const categories = ["All",...new Set(allProducts.map(p => p.category))]

  const filtered = useMemo(() => {
    return allProducts.filter(p => {
      const matchSearch = p.name.toLowerCase().includes(search.toLowerCase())
      const matchCat = category === "All" || p.category === category
      return matchSearch && matchCat
    })
  }, [search, category])

  const addToCart = (product) => {
    setCart(prev => [...prev, product])
  }

  return (
    <div className="min-h-screen bg-[#FCF9F6] text-[#1A1A1A]">
      <Navbar cartCount={cart.length} />

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-5xl font-black tracking-tighter">STORE<span className="text-[#FF4D00]">.</span></h1>
            <p className="text-[#8A7F7A] mt-2 text-sm">Shopify solutions for high-growth brands — by ITGeeks</p>
          </div>

          <div className="flex gap-3">
            <input
              placeholder="Search services..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="border border-[#E8E0D9] bg-white px-5 py-3 rounded-full text-sm w-64 outline-none focus:ring-2 focus:ring-[#FF4D00]/20 focus:border-[#FF4D00]"
            />
            <select
              value={category}
              onChange={e => setCategory(e.target.value)}
              className="border border-[#E8E0D9] bg-white px-5 py-3 rounded-full text-sm outline-none"
            >
              {categories.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-8">
          <div className="bg-white border border-[#E8E0D9] rounded-2xl p-5">
            <div className="text-3xl font-black">{filtered.length}</div>
            <div className="text-xs text-[#8A7F7A] uppercase tracking-widest mt-1">Services Available</div>
          </div>
          <div className="bg-white border border-[#E8E0D9] rounded-2xl p-5">
            <div className="text-3xl font-black">{cart.length}</div>
            <div className="text-xs text-[#8A7F7A] uppercase tracking-widest mt-1">In Your Cart</div>
          </div>
          <div className="bg-[#1A1A1A] text-[#FCF9F6] rounded-2xl p-5">
            <div className="text-3xl font-black"><span className="text-[#FF4D00]">MERN</span> + Docker</div>
            <div className="text-xs text-[#8A7F7A] uppercase tracking-widest mt-1">Production Stack</div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {filtered.map(p => (
            <ProductCard key={p.id} product={p} onAdd={addToCart} />
          ))}
        </div>
      </main>
    </div>
  )
}

export default App