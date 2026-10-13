export default function ProductCard({ product, onAdd }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 hover:border-gray-300 transition">
      {/* product icon */}
      <div className="bg-gray-50 rounded-lg h-36 flex items-center justify-center mb-3 text-3xl">
        {product.emoji}
      </div>

      <div className="mb-3">
        <h3 className="font-medium text-sm leading-tight">{product.name}</h3>
        <div className="flex items-center gap-2 mt-1.5">
          <span className="text- bg-gray-100 px-2 py-0.5 rounded text-gray-600">{product.category}</span>
        </div>
        <p className="text-xs text-gray-500 mt-2 leading-relaxed">{product.desc}</p>
      </div>

      {/* price and button */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
        <span className="font-semibold text-sm">${product.price}</span>
        <button
          onClick={() => onAdd(product)}
          className="text-xs bg-black text-white px-3.5 py-2 rounded-lg hover:bg-gray-900 transition"
        >
          Add to cart
        </button>
      </div>
    </div>
  )
}