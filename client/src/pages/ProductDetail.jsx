import { useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import { API_BASE_URL } from "../config.js"

const ProductDetail = ({ addToCart }) => {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [added, setAdded] = useState(false)

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true)

      try {
        const res = await fetch(`${API_BASE_URL}/api/products/${id}`)

        if (!res.ok) {
          setProduct(null)
          return
        }

        setProduct(await res.json())
      } catch (err) {
        console.error("Could not fetch product:", err)
        setProduct(null)
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [id])

  const handleAddToCart = () => {
    if (typeof addToCart !== "function") {
      console.error("ProductDetail requires an addToCart function prop")
      return
    }

    addToCart(product)
    setAdded(true)
    setTimeout(() => setAdded(false), 1800)
  }

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-gradient-to-br from-violet-50 via-white to-fuchsia-50 px-6">
        <div className="rounded-2xl border border-violet-100 bg-white px-6 py-4 text-sm font-bold text-violet-700 shadow-lg shadow-violet-100/60">
          Loading product...
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-gradient-to-br from-violet-50 via-white to-fuchsia-50 px-6">
        <div className="rounded-3xl border border-violet-100 bg-white p-10 text-center shadow-xl shadow-violet-100/60">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center border border-[#E5E0D8] bg-[#F7F4EF] font-mono text-xs uppercase tracking-[0.08em] text-[#8A8279]">
            Item
          </div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900">
            Product not found
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            It may have been removed or the link may be incorrect.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-fuchsia-50 px-6 py-10 md:py-16">
      <div className="mx-auto grid max-w-6xl overflow-hidden rounded-3xl border border-violet-100 bg-white shadow-2xl shadow-violet-100/70 md:grid-cols-2">
        <div className="flex min-h-72 items-end border-b border-[#E5E0D8] bg-[#F7F4EF] p-8 md:min-h-[500px]">
          <span className="font-mono text-xs uppercase tracking-[0.08em] text-[#8A8279]">
            Service / {product.category}
          </span>
        </div>

        <div className="flex flex-col justify-center p-8 md:p-12">
          <span className="w-fit rounded-full bg-violet-50 px-3 py-1.5 text-xs font-extrabold uppercase tracking-widest text-violet-700 ring-1 ring-violet-100">
            {product.category}
          </span>

          <h1 className="mt-5 text-3xl font-black leading-tight tracking-tight text-slate-900 md:text-4xl">
            {product.name}
          </h1>

          <p className="mt-4 text-base leading-relaxed text-slate-600">
            {product.description}
          </p>

          <div className="mt-8 border-t border-violet-100 pt-6">
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
              Price
            </p>
            <p className="mt-1 text-3xl font-black tracking-tight text-slate-900">
              ₹{product.price}
            </p>
          </div>

          <button
            type="button"
            onClick={handleAddToCart}
            className="mt-8 rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-6 py-4 text-sm font-extrabold text-white shadow-lg shadow-violet-200 transition duration-200 hover:scale-[1.02] hover:from-violet-700 hover:to-fuchsia-700 hover:shadow-xl active:scale-[0.98]"
          >
            {added ? "Added to Cart ✓" : "Add to Cart +"}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProductDetail
