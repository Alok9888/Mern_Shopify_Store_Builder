import { useState, useMemo, useEffect } from "react"
import { Routes, Route } from "react-router-dom"
import Navbar from "./components/Navbar"
import { products as allProducts } from "./data/products"

import StorePage from "./pages/StorePage"
import ProductDetail from "./pages/ProductDetail"
import CartPage from "./pages/CartPage"

function App() {
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem("cart")
    return saved? JSON.parse(saved) : []
  })
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

  // save cart to localStorage whenever cart changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart))
  }, [cart])

  const addToCart = (product) => {
    setCart(prev => {
      const exists = prev.find(item => item.id === product.id)
      if (exists) {
        return prev.map(item =>
          item.id === product.id? {...item, qty: item.qty + 1 } : item
        )
      }
      return [...prev, {...product, qty: 1 }]
    })
  }

  const removeFromCart = (id) => {
    setCart(prev => prev.filter(item => item.id!== id))
  }

  const decreaseQty = (id) => {
    setCart(prev => {
      return prev.map(item => {
        if (item.id === id) {
          if (item.qty === 1) return null // will be filtered
          return {...item, qty: item.qty - 1 }
        }
        return item
      }).filter(Boolean)
    })
  }

  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0)

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