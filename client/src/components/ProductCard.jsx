import { Link } from "react-router-dom"

export default function ProductCard({ product, onAdd }) {
  return (
    <div className="group overflow-hidden rounded-2xl border border-violet-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-violet-300 hover:shadow-xl hover:shadow-violet-100/70">
      <Link to={`/product/${product._id}`}>
        <div className="relative mb-4 flex h-36 items-center justify-center overflow-hidden bg-gradient-to-br from-fuchsia-100 via-violet-100 to-cyan-100 text-5xl transition-all duration-300 group-hover:from-fuchsia-200 group-hover:via-violet-200 group-hover:to-cyan-200">
          <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-white/40 blur-2xl transition-transform duration-500 group-hover:scale-150" />
          <span className="relative drop-shadow-sm transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
            {product.emoji}
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
          className="rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-4 py-2 text-xs font-bold text-white shadow-md shadow-violet-200 transition-all duration-200 hover:scale-105 hover:from-violet-700 hover:to-fuchsia-700 hover:shadow-lg active:scale-95"
        >
          Add to cart <span className="ml-1">+</span>
        </button>
      </div>
    </div>
  )
}