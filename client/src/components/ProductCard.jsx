import { Link } from "react-router-dom"

export default function ProductCard({ product, onAdd }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 hover:border-black transition">
      <Link to={`/product/${product.id}`}>
        <div className="bg-[#f8f8f8] rounded-lg h-28 flex items-center justify-center text-3xl mb-3">
          {product.emoji}
        </div>
        <div className="text-xs bg-gray-100 px-2 py-1 rounded w-fit">{product.category}</div>
        <h3 className="font-semibold mt-2 text-sm">{product.name}</h3>
        <p className="text-xs text-gray-500 mt-1 line-clamp-2">{product.description}</p>
      </Link>
      <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
        <span className="text-sm font-bold">₹{product.price}</span>
        <button 
          onClick={() => onAdd(product)}
          className="bg-black text-white text-xs px-3 py-1.5 rounded-lg hover:bg-zinc-800"
        >
          Add
        </button>
      </div>
    </div>
  )
}