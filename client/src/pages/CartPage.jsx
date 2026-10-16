import { Link } from "react-router-dom"

export default function CartPage({ cart, removeFromCart, addToCart, decreaseQty }) {
  const total = cart.reduce((sum, p) => sum + p.price * p.qty, 0)
  const itemCount = cart.reduce((sum, item) => sum + item.qty, 0)

  if (cart.length === 0) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-gradient-to-br from-violet-50 via-white to-fuchsia-50 px-4 py-16">
        <div className="w-full max-w-md rounded-3xl border border-violet-100 bg-white p-10 text-center shadow-xl shadow-violet-100/60">
          <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-3xl bg-violet-100 text-4xl">
            🛍️
          </div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900">
            Your cart is empty
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Find something you love and add it to your cart.
          </p>
          <Link
            to="/"
            className="mt-7 inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-5 py-3 text-sm font-extrabold text-white shadow-lg shadow-violet-200 transition hover:from-violet-700 hover:to-fuchsia-700 hover:shadow-xl active:scale-[0.98]"
          >
            Explore the store <span className="ml-2">→</span>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-fuchsia-50 px-4 py-10 md:py-14">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8">
          <span className="inline-flex rounded-full bg-violet-100 px-3 py-1 text-xs font-extrabold uppercase tracking-widest text-violet-700">
            Your picks
          </span>
          <h1 className="mt-3 text-3xl font-black tracking-tight text-slate-900 md:text-4xl">
            Shopping cart
            <span className="ml-2 text-lg font-bold text-violet-500">({itemCount})</span>
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Review your items before checkout.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          <div className="space-y-3">
            {cart.map((p) => (
              <div
                key={p._id}
                className="flex flex-col gap-4 rounded-2xl border border-violet-100 bg-white p-4 shadow-sm transition hover:shadow-md sm:flex-row sm:items-center sm:justify-between sm:p-5"
              >
                <div className="flex min-w-0 items-center gap-4">
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-fuchsia-100 via-violet-100 to-cyan-100 text-3xl">
                    {p.emoji}
                  </div>
                  <div className="min-w-0">
                    <h2 className="truncate text-sm font-extrabold text-slate-900">
                      {p.name}
                    </h2>
                    <p className="mt-1 text-xs font-medium text-slate-500">
                      ₹{p.price} each
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 sm:justify-end">
                  <div className="flex items-center gap-2 rounded-xl border border-violet-100 bg-violet-50 p-1">
                    <button
                      onClick={() => decreaseQty(p._id)}
                      aria-label={`Decrease quantity of ${p.name}`}
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-lg font-bold text-violet-700 transition hover:bg-white"
                    >
                      −
                    </button>
                    <span className="w-6 text-center text-sm font-extrabold text-slate-800">
                      {p.qty}
                    </span>
                    <button
                      onClick={() => addToCart(p)}
                      aria-label={`Increase quantity of ${p.name}`}
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-lg font-bold text-violet-700 transition hover:bg-white"
                    >
                      +
                    </button>
                  </div>

                  <span className="min-w-20 text-right text-sm font-black text-slate-900">
                    ₹{p.price * p.qty}
                  </span>

                  <button
                    onClick={() => removeFromCart(p._id)}
                    className="rounded-lg px-2 py-1 text-xs font-bold text-rose-500 transition hover:bg-rose-50 hover:text-rose-700"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          <aside className="h-fit rounded-2xl border border-violet-100 bg-white p-6 shadow-lg shadow-violet-100/50">
            <h2 className="text-lg font-black text-slate-900">Order summary</h2>
            <div className="mt-5 flex justify-between border-t border-violet-100 pt-4 text-sm">
              <span className="font-medium text-slate-500">Subtotal</span>
              <span className="font-bold text-slate-900">₹{total}</span>
            </div>
            <div className="mt-3 flex justify-between text-sm">
              <span className="font-medium text-slate-500">Items</span>
              <span className="font-bold text-slate-900">{itemCount}</span>
            </div>
            <div className="mt-5 flex justify-between border-t border-violet-100 pt-4">
              <span className="font-extrabold text-slate-900">Total</span>
              <span className="text-lg font-black text-violet-700">₹{total}</span>
            </div>
            <Link
              to="/checkout"
              className="mt-6 flex h-12 items-center justify-center rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 text-sm font-extrabold text-white shadow-lg shadow-violet-200 transition hover:from-violet-700 hover:to-fuchsia-700 hover:shadow-xl active:scale-[0.98]"
            >
              Continue to checkout <span className="ml-2">→</span>
            </Link>
            <Link
              to="/"
              className="mt-4 block text-center text-xs font-bold text-violet-700 transition hover:text-fuchsia-700"
            >
              Continue shopping
            </Link>
          </aside>
        </div>
      </div>
    </div>
  )
}