export default function ProductCard({ product, onAdd }) {
  return (
    <div className="group bg-white rounded-2xl border p-4 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:-translate-y-1 transition-all duration-300">
      <div className="h-40 bg-[#f6f6f6] rounded-xl mb-4 flex items-center justify-center group-hover:bg-black group-hover:text-white transition-colors">
        <span className="text-4xl">{product.emoji}</span>
      </div>

      <div className="space-y-1">
        <div className="flex justify-between items-start">
          <h3 className="font-semibold leading-tight text-">{product.name}</h3>
          <span className="text- bg-gray-100 px-2 py-1 rounded-full uppercase tracking-wider">{product.category}</span>
        </div>
        <p className="text-xs text-gray-400 line-clamp-2">{product.desc}</p>
      </div>

      <div className="mt-4 flex justify-between items-center">
        <div>
          <div className="text- text-gray-400 uppercase">Price</div>
          <div className="font-bold text-lg">${product.price}</div>
        </div>
        <button
          onClick={() => onAdd(product)}
          className="bg-black text-white px-4 py-2 rounded-full text-xs font-medium hover:bg-zinc-800 active:scale-95 transition"
        >
          Add +
        </button>
      </div>
    </div>
  )
}