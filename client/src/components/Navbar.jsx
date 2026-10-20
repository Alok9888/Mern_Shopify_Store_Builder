import { Link, useLocation } from "react-router-dom"

export default function Navbar({ cartCount }) {
  const { pathname } = useLocation()
  const isStorePage = pathname === "/store"
  const isAdminDashboard = pathname === "/admin/dashboard"

  return (
    <header className="sticky top-0 z-30 border-b border-[#E5E0D8] bg-[#F7F4EF]">
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4" aria-label="Main navigation">
        <Link to="/store" className="font-display text-xl font-medium tracking-tight text-[#1A1816] no-underline">
          ITGEEKS<span>.</span>
        </Link>

        <div className="flex items-center gap-3">
          {!isAdminDashboard && (
            <Link
              to="/cart"
              className="nav-action-secondary inline-flex items-center gap-2 px-4 py-2 text-sm no-underline transition-colors duration-150"
            >
              Cart <span className="font-mono text-xs text-[#8A8279]">{cartCount}</span>
            </Link>
          )}
          <Link
            to={isStorePage ? "/admin/dashboard" : "/store"}
            className="nav-action-secondary inline-flex items-center px-4 py-2 text-sm no-underline transition-colors duration-150"
          >
            {isStorePage ? "Admin" : "Store"}
          </Link>
        </div>
      </nav>
    </header>
  )
}
