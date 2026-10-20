import { Link } from "react-router-dom"

export default function ProductCard({ product, onAdd }) {
  return (
    <div className="group overflow-hidden rounded-2xl border border-violet-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-violet-300 hover:shadow-xl hover:shadow-violet-100/70">
      <Link to={`/product/${product._id}`}>
        <div className="mb-4 flex h-36 items-end border-b border-[#E5E0D8] bg-[#F7F4EF] p-4">
          <span className="font-mono text-xs uppercase tracking-[0.08em] text-[#8A8279]">
            Service / {product.category}
          </span>
        </div>

        <div className="px-4">
          <div className="w-fit rounded-full bg-violet-50 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-violet-700 ring-1 ring-violet-100">
            {product.category}
          </div>
          <h3 className="mt-3 text-base font-extrabold tracking-tight text-slate-900 transition-colors group-hover:text-violet-700">
            {product.name}
          </h3>
          <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-slate-500">
            {product.description}
          </p>
        </div>
      </Link>

      <div className="mx-4 mt-4 flex items-center justify-between border-t border-violet-100 py-4">
        <span className="text-lg font-black tracking-tight text-slate-900">
          ₹{product.price}
        </span>
        <button 
          onClick={() => onAdd(product)}
          className="card-action-secondary rounded-sm border border-[#E5E0D8] bg-transparent px-4 py-2 text-xs font-medium text-[#1A1816] transition-colors duration-150 hover:bg-[#F7F4EF]"
        >
          Add to cart <span className="ml-1">+</span>
        </button>
      </div>
    </div>
  )
}
