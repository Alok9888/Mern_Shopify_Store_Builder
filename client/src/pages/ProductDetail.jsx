import { useParams } from "react-router-dom"
import { useEffect, useState } from "react"

const ProductDetail = ({ addToCart }) => {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    console.log("id from url:", id)
    const fetchProduct = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/products/${id}`)
        const data = await res.json()
        setProduct(data)
      } catch (err) {
        console.log(err)
      } finally {
        setLoading(false)
      }
    }
    fetchProduct()
  }, [id])

  if (loading) return <p className="p-10">loading...</p>
  if (!product) return <p className="p-10">not found</p>

  return (
    <div className="p-10 max-w-4xl mx-auto flex gap-10">
      <div className="text-8xl">{product.emoji}</div>
      <div>
        <h1 className="text-3xl font-bold">{product.name}</h1>
        <p className="text-gray-600 mt-2">{product.category}</p>
        <p className="mt-4">{product.description}</p>
        <p className="text-2xl font-bold mt-4">₹{product.price}</p>
        <button
          onClick={() => addToCart(product)}
          className="mt-6 bg-black text-white px-6 py-2 rounded"
        >
          Add to Cart
        </button>
      </div>
    </div>
  )
}

export default ProductDetail