import { useState, useMemo, useEffect, useContext } from "react"
import { Routes, Route, Navigate } from "react-router-dom"
import Navbar from "./components/Navbar"
import StorePage from "./pages/StorePage"
import ProductDetail from "./pages/ProductDetail"
import CartPage from "./pages/CartPage"
import AdminPage from "./pages/AdminPage"
import CheckoutPage from "./pages/CheckoutPage"
import AdminLogin from "./pages/AdminLogin"
import AdminProtected from "./components/AdminProtected"
import { AuthContext } from "./context/AuthContext"
import { API_BASE_URL } from "./config.js"
import OrderSuccess from "./pages/OrderSuccess"
import PaymentPage from "./pages/PaymentPage"
import {
  addItem,
  removeItem,
  decreaseItem,
  getCartCount,
} from "./utils/cart.js"


function AdminRoot() {
  const { token } = useContext(AuthContext)
  if (token) return <Navigate to="/admin/dashboard" replace />
  return <AdminLogin />
}

function App() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
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

  const fetchProducts = async () => {
    try {
      setLoading(true)
      setError(null)
      const res = await fetch(`${API_BASE_URL}/api/products`)
      if (!res.ok) throw new Error(`Server error: ${res.status}`)
      const data = await res.json()
      setProducts(data)
    } catch (err) {
      console.log(err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart))
  }, [cart])

  const clearCart = () => setCart([])
  const addToCart = (product) => {
  setCart((currentCart) => addItem(currentCart, product))
  }
  const removeFromCart = (id) => {
  setCart((currentCart) => removeItem(currentCart, id))
  }
  const decreaseQty = (id) => {
    setCart((currentCart) => decreaseItem(currentCart, id))
  }

  const cartCount = getCartCount(cart)
  return (
    <div className="min-h-screen bg-[#F7F4EF]">
      <Navbar cartCount={cartCount} />

      <Routes>
        <Route path="/" element={<AdminRoot />} />
        <Route path="/store" element={loading ? (
          <div className="p-10 text-center text-xl">Loading products from backend...</div>
        ) : error ? (
          <div className="p-10 text-center text-rose-700">Could not load products: {error}</div>
        ) : (
          <StorePage
            filtered={filtered}
            search={search}
            setSearch={setSearch}
            category={category}
            setCategory={setCategory}
            categories={categories}
            addToCart={addToCart}
          />
        )} />
        <Route path="/product/:id" element={<ProductDetail addToCart={addToCart} />} />
        <Route path="/cart" element={
          <CartPage
            cart={cart}
            removeFromCart={removeFromCart}
            addToCart={addToCart}
            decreaseQty={decreaseQty}
          />
        } />
        <Route path="/admin" element={<AdminRoot />} />
        <Route path="/admin/dashboard" element={
          <AdminProtected>
            <AdminPage products={products} refresh={fetchProducts} />
          </AdminProtected>
        } />
        <Route path="/checkout" element={<CheckoutPage cart={cart}/>} />
        <Route path="/payment" element={<PaymentPage cart={cart} clearCart={clearCart} />} />
        <Route path="/order-success" element={<OrderSuccess/>}/>
      </Routes>
    </div>
  )
}

export default App
