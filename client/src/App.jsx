import { useState, useMemo, useEffect } from "react"
import { Routes, Route } from "react-router-dom"
import Navbar from "./components/Navbar"
import StorePage from "./pages/StorePage"
import ProductDetail from "./pages/ProductDetail"
import CartPage from "./pages/CartPage"

function App() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem("cart")
    return saved? JSON.parse(saved) : []
  })
  const [search, setSearch] = useState("")
  const [category, setCategory] = useState("All")

  const categories = ["All",...new Set(products.map(p => p.category))]

    const filtered = useMemo(() => {
    return products.filter(p => {
      const matchSearch = p.name.toLowerCase().includes(search.toLowerCase())
      const matchCat = category === "All" || p.category === category
      return matchSearch && matchCat
    })
  }, [products, search, category])

  // also fix loading on error
  useEffect(() => {
    fetch("http://localhost:5000/api/products")
      .then(res => res.json())
      .then(data => {
        setProducts(data)
        setLoading(false)
      })
      .catch(err => {
        console.log(err)
        setLoading(false)
      })
  }, [])

  // save cart to localStorage whenever cart changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart))
  }, [cart])

 // addToCart
const addToCart = (product) => {
  setCart(prev => {
    const exists = prev.find(item => item._id === product._id)
    if (exists) {
      return prev.map(item =>
        item._id === product._id? {...item, qty: item.qty + 1 } : item
      )
    }
    return [...prev, {...product, qty: 1 }]
  })
}

const removeFromCart = (id) => {
  setCart(prev => prev.filter(item => item._id !== id))
}

const decreaseQty = (id) => {
  setCart(prev => {
    return prev
      .map(item => {
        if (item._id === id) {
          if (item.qty === 1) return null
          return {...item, qty: item.qty - 1 }
        }
        return item
      })
      .filter(Boolean)
  })
}

  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0)
  if (loading) return <div className="p-10 text-center text-xl">Loading products from backend...</div>

  return (
    <div className="min-h-screen bg-[#f8f8f8]">
      <Navbar cartCount={cartCount} />

      <Routes>
        <Route path="/" element={
          <StorePage
            filtered={filtered}
            search={search}
            setSearch={setSearch}
            category={category}
            setCategory={setCategory}
            categories={categories}
            addToCart={addToCart}
          />
        } />
        <Route path="/product/:id" element={<ProductDetail onAdd={addToCart} />} />
        <Route path="/cart" element={
          <CartPage
            cart={cart}
            removeFromCart={removeFromCart}
            addToCart={addToCart}
            decreaseQty={decreaseQty}
          />
        } />
      </Routes>
    </div>
  )
}

export default App