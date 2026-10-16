import { useEffect, useState } from "react"
import { Link } from "react-router-dom"

export default function Navbar({ cartCount }) {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    let previousScrollY = window.scrollY

    const handleScroll = () => {
      const currentScrollY = window.scrollY
      const scrollingUp = currentScrollY < previousScrollY

      setVisible(currentScrollY < 10 || scrollingUp)
      previousScrollY = currentScrollY
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <div
      className={`sticky top-0 z-30 border-b border-violet-100 bg-white/85 shadow-sm shadow-violet-100/50 backdrop-blur-xl transition-transform duration-300 ${
        visible ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link
          to="/"
          className="group text-2xl font-black tracking-tight text-slate-900 transition hover:text-violet-700"
        >
          Shopify<span className="text-fuchsia-600 transition group-hover:text-violet-600">.</span>
        </Link>

        <div className="flex items-center gap-3">
          <Link
            to="/cart"
            className="group inline-flex items-center gap-2 rounded-xl border border-violet-100 bg-violet-50 px-4 py-2 text-sm font-bold text-violet-800 transition hover:border-violet-300 hover:bg-violet-100"
          >
            <span>Cart</span>
            <span className="flex h-6 min-w-6 items-center justify-center rounded-lg bg-white px-1.5 text-xs font-extrabold text-fuchsia-700 shadow-sm">
              {cartCount}
            </span>
          </Link>

          <Link
            to="/admin"
            className="rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-4 py-2 text-sm font-bold text-white shadow-md shadow-violet-200 transition hover:scale-105 hover:from-violet-700 hover:to-fuchsia-700 hover:shadow-lg active:scale-95"
          >
            Admin
          </Link>
        </div>
      </div>
    </div>
  )
}