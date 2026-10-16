import { useState, useContext } from "react"
import { useNavigate } from "react-router-dom"
import { AuthContext } from "../context/AuthContext.jsx"

const DEMO = {
  email: "admin@shop.com",
  password: "admin123",
}

export default function AdminLogin() {
  const [email, setEmailInput] = useState("")
  const [password, setPasswordInput] = useState("")
  const [show, setShow] = useState(false)
  const { setToken, setEmail } = useContext(AuthContext)
  const navigate = useNavigate()

  const login = async (e) => {
    e.preventDefault()
    const res = await fetch("http://localhost:5000/api/admin-auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    })
    const data = await res.json()
    if (res.ok) {
      setToken(data.token)
      setEmail(data.email)
      navigate("/admin/dashboard")
    } else alert(data.message)
  }

  const fillDemo = () => {
    setEmailInput(DEMO.email)
    setPasswordInput(DEMO.password)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-violet-50 via-white to-fuchsia-50 px-4 py-12">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="mb-7 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 px-4 py-2 text-xs font-extrabold tracking-widest text-white shadow-lg shadow-violet-200">
            SHOPIFY <span className="text-white/60">•</span> ADMIN
          </div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900">
            Welcome back
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Sign in to manage your store
          </p>
        </div>

        <div className="overflow-hidden rounded-3xl border border-violet-100 bg-white shadow-2xl shadow-violet-100/70">
          <form onSubmit={login} className="space-y-5 p-7 md:p-8">
            <div className="space-y-2">
              <label className="text-xs font-extrabold uppercase tracking-widest text-slate-500">
                Email address
              </label>
              <input
                type="email"
                autoComplete="username"
                value={email}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="admin@shop.com"
                className="h-12 w-full rounded-xl border border-violet-100 bg-violet-50/60 px-4 text-sm font-medium text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-violet-400 focus:bg-white focus:ring-4 focus:ring-violet-100"
                required
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-extrabold uppercase tracking-widest text-slate-500">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setShow(!show)}
                  className="text-xs font-bold text-violet-700 transition hover:text-fuchsia-700"
                >
                  {show ? "Hide" : "Show"}
                </button>
              </div>
              <input
                type={show ? "text" : "password"}
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="Enter your password"
                className="h-12 w-full rounded-xl border border-violet-100 bg-violet-50/60 px-4 text-sm font-medium text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-violet-400 focus:bg-white focus:ring-4 focus:ring-violet-100"
                required
              />
            </div>

            <button className="h-12 w-full rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 text-sm font-extrabold text-white shadow-lg shadow-violet-200 transition hover:from-violet-700 hover:to-fuchsia-700 hover:shadow-xl active:scale-[0.99]">
              Continue to dashboard <span className="ml-1">→</span>
            </button>
          </form>

          {/* Demo Box */}
          <div className="border-t border-violet-100 bg-violet-50/50 p-6">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-xs font-extrabold uppercase tracking-widest text-violet-700">
                Demo access
              </p>
              <span className="text-lg">⚡</span>
            </div>

            <div className="mb-3 grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-violet-100 bg-white px-3 py-3">
                <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                  Email
                </p>
                <p className="mt-1 truncate font-mono text-xs font-semibold text-slate-700">
                  {DEMO.email}
                </p>
              </div>
              <div className="rounded-xl border border-violet-100 bg-white px-3 py-3">
                <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                  Password
                </p>
                <p className="mt-1 font-mono text-xs font-semibold text-slate-700">
                  {DEMO.password}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={fillDemo}
              className="flex h-10 w-full items-center justify-center gap-2 rounded-xl border border-violet-200 bg-white text-xs font-extrabold text-violet-700 transition hover:border-violet-300 hover:bg-violet-100"
            >
              <span>⚡</span> Use demo credentials
            </button>
            <p className="mt-3 text-center text-[11px] leading-relaxed text-slate-400">
              Credentials are provided to showcase the project functionality.
            </p>
          </div>
        </div>

        <p className="mt-5 text-center text-xs font-medium text-slate-400">
          Secure admin area <span className="mx-1">•</span> Session expires on page reload
        </p>
      </div>
    </div>
  )
}