import { Link } from "react-router-dom"
export default function OrderSuccess(){
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white border rounded- p-10 text-center max-w-sm">
        <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto text-2xl mb-4">✓</div>
        <h1 className="text-xl font-bold">Order Placed!</h1>
        <p className="text-sm text-zinc-500 mt-2">Mock payment successful. Showcase flow complete.</p>
        <Link to="/" className="block mt-6 h-11 leading- bg-black text-white rounded-xl font-semibold">Continue Shopping</Link>
      </div>
    </div>
  )
}