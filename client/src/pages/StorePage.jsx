import ProductCard from "../components/ProductCard"
import ServiceFinder from "../components/ServiceFinder"

export default function StorePage({ filtered, search, setSearch, category, setCategory, categories, addToCart }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-fuchsia-50">
      {/* Sticky header bar */}
      <div className="border-b border-violet-100 bg-white/85 shadow-sm shadow-violet-100/50 backdrop-blur-xl">
        <div className="mx-auto flex max-w-5xl flex-col justify-between gap-5 px-6 py-6 md:flex-row md:items-end">
          <div>
            <span className="mb-2 inline-flex rounded-full bg-violet-100 px-3 py-1 text-xs font-bold uppercase tracking-widest text-violet-700">
              Discover
            </span>
            <h1 className="text-4xl font-black leading-none tracking-tight text-slate-900 md:text-5xl">
              Store<span className="text-fuchsia-600">.</span>
            </h1>
            <p className="mt-2 text-sm font-medium text-slate-500">
              Services we build at our platform
            </p>
          </div>

          <div className="flex w-full items-center gap-3 md:w-auto">
            <div className="relative flex-1 md:w-80">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg text-violet-500">
                ⌕
              </span>
              <input
                placeholder="Search services..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="h-12 w-full rounded-2xl border border-violet-100 bg-violet-50/70 pl-11 pr-4 text-sm font-medium text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-violet-400 focus:bg-white focus:ring-4 focus:ring-violet-100"
              />
            </div>
            <select
              value={category}
              onChange={e => setCategory(e.target.value)}
              className="h-12 cursor-pointer rounded-2xl border border-violet-100 bg-white px-4 pr-9 text-sm font-bold text-slate-700 outline-none transition focus:border-violet-400 focus:ring-4 focus:ring-violet-100"
            >
              {categories.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-6 py-10">
        <ServiceFinder onAdd={addToCart} />

        <div className="mb-6 flex items-center justify-between">
          <p className="text-sm font-semibold text-slate-500">
            <span className="text-violet-700">{filtered.length}</span> services to explore
          </p>
          <div className="hidden h-px flex-1 bg-[#E5E0D8] sm:ml-6 sm:block" />
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {filtered.map(p => (
            <ProductCard key={p._id} product={p} onAdd={addToCart} />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="mt-8 rounded-3xl border-2 border-dashed border-violet-200 bg-white/80 py-24 text-center shadow-sm">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center border border-[#E5E0D8] bg-[#F7F4EF] font-mono text-xs uppercase tracking-[0.08em] text-[#8A8279]">
              Search
            </div>
            <p className="text-lg font-extrabold text-slate-800">No services found</p>
            <p className="mt-1 text-sm text-slate-500">Try another search or category.</p>
          </div>
        )}
      </div>
    </div>
  )
}
