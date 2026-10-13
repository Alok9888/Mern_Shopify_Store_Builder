import { useState, useMemo } from "react"
import Navbar from "./components/Navbar"
import ProductCard from "./components/ProductCard"
import { products as allProducts } from "./data/products"

function App() {
  const [cart, setCart] = useState([])
  const [search, setSearch] = useState("")
  const [category, setCategory] = useState("All")

  // categories from products
  const categories = ["All",...new Set(allProducts.map(p => p.category))]

  // filter by search and category
  const filtered = useMemo(() => {
    return allProducts.filter(p => {
      const matchSearch = p.name.toLowerCase().includes(search.toLowerCase())
      const matchCat = category === "All" || p.category === category
      return matchSearch && matchCat
    })
  }, [search, category])

  const addToCart = (product) => {
    setCart([...cart, product])
  }

  return (
    <div className="min-h-screen bg-[#f8f8f8]">
      <Navbar cartCount={cart.length} />

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* top section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Store</h1>
            <p className="text-gray-500 text-sm mt-1">Services we build at ITGeeks</p>
          </div>
          {/* search and filter controls */}
          <div className="flex gap-2">
            <input
              placeholder="Search services..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="bg-white border border-gray-200 rounded-lg px-4 py-2 text-sm w-full md:w-64 outline-none focus:border-black"
            />
            <select
              value={category}
              onChange={e => setCategory(e.target.value)}
              className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none"
            >
              {categories.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
        </div>

        {/* products grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {filtered.map(p => (
            <ProductCard key={p.id} product={p} onAdd={addToCart} />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16 text-gray-400 text-sm">No products found</div>
        )}
      </div>
    </div>
  )
}

export default App