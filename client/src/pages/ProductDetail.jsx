import { useParams, Link } from "react-router-dom"
import { products } from "../data/products"

export default function ProductDetail({ onAdd }) {
  const { id } = useParams()
  const product = products.find(p => p.id === parseInt(id))

  if (!product) {
    return <div className="max-w-6xl mx-auto px-4 py-16 text-center">Product not found</div>
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <Link to="/" className="text-sm text-gray-500 hover:text-black mb-6 inline-block">← Back to store</Link>
      
      <div className="bg-white border border-gray-200 rounded-xl p-8 grid md:grid-cols-2 gap-8">
        <div className="bg-[#f8f8f8] rounded-lg h-80 flex items-center justify-center text-6xl">
          {product.emoji}
        </div>
        <div>
          <span className="text-xs bg-gray-100 px-2 py-1 rounded">{product.category}</span>
          <h1 className="text-3xl font-bold mt-3">{product.name}</h1>
          <p className="text-gray-500 mt-3 text-sm leading-relaxed">{product.description} This is Shopify service we build at ITGeeks. High quality, fast delivery, clean code.</p>
          <div className="text-2xl font-bold mt-6">₹{product.price}</div>
          <button 
            onClick={() => onAdd(product)}
            className="mt-6 bg-black text-white px-6 py-2.5 rounded-lg text-sm hover:bg-zinc-800 w-full md:w-auto"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  )
}