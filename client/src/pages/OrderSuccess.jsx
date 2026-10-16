import { Link } from "react-router-dom"

export default function OrderSuccess() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-violet-50 via-white to-fuchsia-50 px-6 py-12">
      <div className="w-full max-w-md rounded-3xl border border-violet-100 bg-white p-10 text-center shadow-2xl shadow-violet-100/70">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-emerald-100 to-teal-100 text-4xl font-black text-emerald-600 shadow-inner">
          ✓
        </div>

        <span className="inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-extrabold uppercase tracking-widest text-emerald-700 ring-1 ring-emerald-100">
          Success
        </span>

        <h1 className="mt-4 text-3xl font-black tracking-tight text-slate-900">
          Order placed!
        </h1>

        <p className="mt-3 text-sm leading-relaxed text-slate-500">
          Thanks for shopping with us. Your order is confirmed and is being prepared.
        </p>

        <Link
          to="/"
          className="mt-8 flex h-12 w-full items-center justify-center rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-600 text-sm font-extrabold text-white shadow-lg shadow-violet-200 transition hover:from-violet-700 hover:to-fuchsia-700 hover:shadow-xl active:scale-[0.98]"
        >
          Continue shopping
          <span className="ml-2 text-lg">→</span>
        </Link>
      </div>
    </div>
  )
}