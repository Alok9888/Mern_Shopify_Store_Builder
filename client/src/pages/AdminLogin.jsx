import { useState, useContext } from "react"
import { useNavigate } from "react-router-dom"
import { AuthContext } from "../context/AuthContext.jsx"

const DEMO = {
  email: "admin@shop.com",
  password: "admin123"
}

export default function AdminLogin(){
  const [email, setEmailInput] = useState("")
  const [password, setPasswordInput] = useState("")
  const [show, setShow] = useState(false)
  const { setToken, setEmail } = useContext(AuthContext)
  const navigate = useNavigate()

  const login = async (e)=>{
    e.preventDefault()
    const res = await fetch("http://localhost:5000/api/admin-auth/login",{
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body: JSON.stringify({email,password})
    })
    const data = await res.json()
    if(res.ok){
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
    <div className="min-h-screen bg-[#fcfcfc] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-">
        {/* Header */}
        <div className="text-center mb-7">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-black text-white text- tracking-widest font-semibold mb-4">SHOPIFY • ADMIN</div>
          <h1 className="text- font-bold tracking-tight">Welcome back</h1>
          <p className="text-sm text-zinc-500 mt-1.5">Sign in to manage your store</p>
        </div>

        <div className="bg-white rounded- border border-zinc-200 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.15)] overflow-hidden">
          <form onSubmit={login} className="p-7 space-y-5">
            <div className="space-y-1.5">
              <label className="text- font-semibold tracking-widest text-zinc-500 uppercase">Email address</label>
              <input value={email} onChange={e=>setEmailInput(e.target.value)} placeholder="admin@shop.com" className="w-full h-11 bg-zinc-50 border border-zinc-200 px-4 rounded-xl text- outline-none focus:bg-white focus:border-black focus:ring-4 focus:ring-zinc-100 transition" required />
            </div>
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text- font-semibold tracking-widest text-zinc-500 uppercase">Password</label>
                <button type="button" onClick={()=>setShow(!show)} className="text- text-zinc-500 hover:text-black">{show?'Hide':'Show'}</button>
              </div>
              <input type={show?'text':'password'} value={password} onChange={e=>setPasswordInput(e.target.value)} placeholder="••••••••" className="w-full h-11 bg-zinc-50 border border-zinc-200 px-4 rounded-xl text- outline-none focus:bg-white focus:border-black focus:ring-4 focus:ring-zinc-100 transition" required />
            </div>

            <button className="w-full h-11 bg-black text-white rounded-xl text- font-semibold hover:bg-zinc-900 active:scale-[0.99] transition">Continue to Dashboard →</button>
          </form>

          {/* Demo Box */}
          <div className="bg-[#fafafa] border-t p-5">
            <div className="flex items-center justify-between mb-3">
              <p className="text- font-bold tracking-widest uppercase text-zinc-500">Demo Access</p>
            </div>
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div className="bg-white border rounded-xl px-3 py-2.5">
                <p className="text- text-zinc-400 uppercase tracking-wide">Email</p>
                <p className="text- font-mono font-medium mt-0.5 truncate">{DEMO.email}</p>
              </div>
              <div className="bg-white border rounded-xl px-3 py-2.5">
                <p className="text- text-zinc-400 uppercase tracking-wide">Password</p>
                <p className="text- font-mono font-medium mt-0.5">{DEMO.password}</p>
              </div>
            </div>
            <button type="button" onClick={fillDemo} className="w-full h-10 bg-white border border-zinc-200 rounded-xl text- font-semibold hover:bg-zinc-50 transition flex items-center justify-center gap-2">
              <span>⚡</span> Use demo credentials
            </button>
            <p className="text- text-zinc-400 text-center mt-3 leading-relaxed">* Credentials are provided solely to showcase the project functionality.</p>
          </div>
        </div>

        <p className="text-center text- text-zinc-400 mt-5">Secure admin area • Session expires on page reload</p>
      </div>
    </div>
  )
}