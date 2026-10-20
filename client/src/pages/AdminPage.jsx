import { useState, useContext, useEffect, useMemo } from "react"
import { useNavigate } from "react-router-dom"
import { AuthContext } from "../context/AuthContext.jsx"
import { API_BASE_URL } from "../config.js"

const ORDER_STATUSES = ["new", "processing", "shipped", "completed", "cancelled"]

const statusLabel = (status) =>
  (status || "new").replace(/^./, (letter) => letter.toUpperCase())

const statusClass = (status) => {
  const styles = {
    new: "bg-sky-50 text-sky-700 ring-sky-100",
    processing: "bg-amber-50 text-amber-700 ring-amber-100",
    shipped: "bg-violet-50 text-violet-700 ring-violet-100",
    completed: "bg-emerald-50 text-emerald-700 ring-emerald-100",
    cancelled: "bg-rose-50 text-rose-700 ring-rose-100",
  }
  return styles[status || "new"] || styles.new
}

const formatDate = (value) =>
  value
    ? new Intl.DateTimeFormat(undefined, {
        dateStyle: "medium",
        timeStyle: "short",
      }).format(new Date(value))
    : "Date unavailable"

export default function AdminPage({ products, refresh }) {
  const { token, email, setToken, setEmail } = useContext(AuthContext)
  const navigate = useNavigate()
  const [form, setForm] = useState({
    name: "", price: "", category: "", emoji: "", description: "",
  })
  const [orders, setOrders] = useState([])
  const [ordersLoading, setOrdersLoading] = useState(true)
  const [ordersError, setOrdersError] = useState("")
  const [orderSearch, setOrderSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [updatingOrderId, setUpdatingOrderId] = useState("")

  const loadOrders = async () => {
    setOrdersLoading(true)
    setOrdersError("")
    try {
      const response = await fetch(`${API_BASE_URL}/api/orders`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.message || "Could not load orders")
      setOrders(data)
    } catch (error) {
      setOrdersError(error.message || "Could not load orders")
    } finally {
      setOrdersLoading(false)
    }
  }

  useEffect(() => {
    if (token) loadOrders()
  }, [token])

  const filteredOrders = useMemo(() => {
    const query = orderSearch.trim().toLowerCase()
    return orders.filter((order) => {
      const matchesStatus = statusFilter === "all" || (order.fulfillmentStatus || "new") === statusFilter
      const searchable = [
        order._id,
        order.customer?.name,
        order.customer?.email,
        order.customer?.phone,
      ].filter(Boolean).join(" ").toLowerCase()
      return matchesStatus && (!query || searchable.includes(query))
    })
  }, [orders, orderSearch, statusFilter])

  const updateOrderStatus = async (orderId, fulfillmentStatus) => {
    setUpdatingOrderId(orderId)
    setOrdersError("")
    try {
      const response = await fetch(`${API_BASE_URL}/api/orders/${orderId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ fulfillmentStatus }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.message || "Could not update order")
      setOrders((current) => current.map((order) => order._id === orderId ? data : order))
      setSelectedOrder((current) => current?._id === orderId ? data : current)
    } catch (error) {
      setOrdersError(error.message || "Could not update order")
    } finally {
      setUpdatingOrderId("")
    }
  }

  const handleLogout = () => {
    setToken(null)
    setEmail(null)
    navigate("/admin")
  }

  const handleAdd = async (event) => {
    event.preventDefault()
    try {
      const response = await fetch(`${API_BASE_URL}/api/products`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ...form, price: Number(form.price) }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.message || "Could not add service")
      setForm({ name: "", price: "", category: "", emoji: "", description: "" })
      await refresh()
    } catch (error) {
      alert(error.message || "Could not add service")
    }
  }

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/products/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!response.ok) throw new Error("Could not delete service")
      await refresh()
    } catch (error) {
      alert(error.message || "Could not delete service")
    }
  }

  const inputClass =
    "w-full rounded-xl border border-violet-100 bg-white px-4 py-3 text-sm font-medium text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-violet-400 focus:ring-4 focus:ring-violet-100"

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-fuchsia-50">
      <header className="border-b border-violet-100 bg-white/85 shadow-sm shadow-violet-100/50 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-widest text-violet-600">Dashboard</span>
            <h1 className="text-xl font-black tracking-tight text-slate-900">Admin Panel</h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden rounded-full border border-violet-100 bg-violet-50 px-4 py-2 text-sm font-semibold text-violet-800 sm:inline-flex">{email}</span>
            <button onClick={handleLogout} className="btn-accent rounded-xl border border-rose-100 bg-rose-50 px-4 py-2 text-sm font-bold text-rose-600 transition hover:border-rose-200 hover:bg-rose-100">Logout</button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl space-y-12 px-6 py-10">
        <section>
          <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <span className="inline-flex rounded-full bg-sky-100 px-3 py-1 text-xs font-extrabold uppercase tracking-widest text-sky-700">Operations</span>
              <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-900">Order management</h2>
              <p className="mt-1 text-sm text-slate-500">Review purchases and keep fulfillment moving.</p>
            </div>
            <button onClick={loadOrders} disabled={ordersLoading} className="rounded-xl border border-violet-200 bg-white px-4 py-2.5 text-sm font-bold text-violet-700 transition hover:bg-violet-50 disabled:opacity-50">
              {ordersLoading ? "Refreshing…" : "↻ Refresh orders"}
            </button>
          </div>

          <div className="mb-5 grid gap-3 sm:grid-cols-3">
            {[{ label: "All orders", value: orders.length }, { label: "Awaiting processing", value: orders.filter((order) => (order.fulfillmentStatus || "new") === "new").length }, { label: "In progress", value: orders.filter((order) => ["processing", "shipped"].includes(order.fulfillmentStatus)).length }].map((stat) => (
              <div key={stat.label} className="rounded-2xl border border-violet-100 bg-white p-4 shadow-sm">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">{stat.label}</p>
                <p className="mt-1 text-2xl font-black text-slate-900">{stat.value}</p>
              </div>
            ))}
          </div>

          <div className="mb-4 flex flex-col gap-3 sm:flex-row">
            <input value={orderSearch} onChange={(event) => setOrderSearch(event.target.value)} placeholder="Search order, customer, email, or phone" className={`${inputClass} sm:flex-1`} />
            <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} className="rounded-xl border border-violet-100 bg-white px-4 py-3 text-sm font-semibold text-slate-700 outline-none focus:border-violet-400 focus:ring-4 focus:ring-violet-100">
              <option value="all">All fulfillment statuses</option>
              {ORDER_STATUSES.map((status) => <option key={status} value={status}>{statusLabel(status)}</option>)}
            </select>
          </div>

          {ordersError && <div role="alert" className="mb-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">{ordersError}</div>}

          <div className="overflow-hidden rounded-2xl border border-violet-100 bg-white shadow-xl shadow-violet-100/40">
            {ordersLoading ? (
              <p className="px-6 py-12 text-center text-sm font-medium text-slate-500">Loading orders…</p>
            ) : filteredOrders.length === 0 ? (
              <div className="px-6 py-12 text-center">
                <p className="font-bold text-slate-800">{orders.length ? "No matching orders" : "No orders yet"}</p>
                <p className="mt-1 text-sm text-slate-500">Orders placed by customers will appear here.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[760px] text-left text-sm">
                  <thead className="bg-violet-50/70 text-[11px] uppercase tracking-wider text-slate-500">
                    <tr><th className="px-5 py-3 font-extrabold">Order / Date</th><th className="px-5 py-3 font-extrabold">Customer</th><th className="px-5 py-3 font-extrabold">Total</th><th className="px-5 py-3 font-extrabold">Payment</th><th className="px-5 py-3 font-extrabold">Fulfillment</th><th className="px-5 py-3" /></tr>
                  </thead>
                  <tbody className="divide-y divide-violet-50">
                    {filteredOrders.map((order) => (
                      <tr key={order._id} className="transition hover:bg-violet-50/40">
                        <td className="px-5 py-4"><button onClick={() => setSelectedOrder(order)} className="font-bold text-violet-700 hover:text-fuchsia-700">#{order._id.slice(-7).toUpperCase()}</button><p className="mt-1 text-xs text-slate-400">{formatDate(order.createdAt)}</p></td>
                        <td className="px-5 py-4"><p className="font-semibold text-slate-800">{order.customer?.name || "Customer"}</p><p className="mt-1 text-xs text-slate-400">{order.customer?.email || order.customer?.phone || "—"}</p></td>
                        <td className="px-5 py-4 font-extrabold text-slate-900">₹{Number(order.totalAmount || 0).toLocaleString("en-IN")}</td>
                        <td className="px-5 py-4"><span className="font-semibold capitalize text-slate-700">{order.paymentMethod || "—"}</span><p className="mt-1 text-xs capitalize text-slate-400">{order.paymentStatus || "pending"}</p></td>
                        <td className="px-5 py-4"><span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold ring-1 ring-inset ${statusClass(order.fulfillmentStatus)}`}>{statusLabel(order.fulfillmentStatus)}</span></td>
                        <td className="px-5 py-4 text-right"><button onClick={() => setSelectedOrder(order)} className="rounded-lg border border-violet-100 px-3 py-2 text-xs font-bold text-violet-700 hover:bg-violet-50">Details</button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>

        <section>
          <div className="mb-6">
            <span className="inline-flex rounded-full bg-fuchsia-100 px-3 py-1 text-xs font-extrabold uppercase tracking-widest text-fuchsia-700">Catalog</span>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-900">Add a service</h2>
            <p className="mt-1 text-sm text-slate-500">Create a new service listing for your store.</p>
          </div>

          <form onSubmit={handleAdd} className="mb-8 grid grid-cols-1 gap-4 rounded-3xl border border-violet-100 bg-white p-6 shadow-xl shadow-violet-100/50 md:grid-cols-2 md:p-8">
            <input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder="Service name" className={inputClass} required />
            <input value={form.price} onChange={(event) => setForm({ ...form, price: event.target.value })} placeholder="Price" type="number" min="0" step="0.01" className={inputClass} required />
            <input value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })} placeholder="Category" className={inputClass} required />
            <input value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} placeholder="Description" className={`${inputClass} md:col-span-2`} required />
            <button className="rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 py-3.5 text-sm font-extrabold text-white shadow-lg shadow-violet-200 transition hover:from-violet-700 hover:to-fuchsia-700 hover:shadow-xl active:scale-[0.99] md:col-span-2">+ Add service</button>
          </form>

          <section className="overflow-hidden rounded-3xl border border-violet-100 bg-white shadow-xl shadow-violet-100/50">
            <div className="flex items-center justify-between border-b border-violet-100 px-6 py-5"><div><h3 className="text-lg font-black text-slate-900">All services</h3><p className="mt-1 text-xs text-slate-500">Manage your store catalog</p></div><span className="rounded-full bg-violet-100 px-3 py-1 text-sm font-extrabold text-violet-700">{products.length}</span></div>
            {products.length === 0 ? <p className="px-6 py-10 text-center text-sm text-slate-500">No services yet. Add one using the form above.</p> : <div className="divide-y divide-violet-50">{products.map((product) => <div key={product._id} className="flex items-center justify-between gap-4 px-6 py-4 transition hover:bg-violet-50/50"><div className="flex min-w-0 items-center gap-3"><span className="flex h-11 w-11 shrink-0 items-center justify-center border border-[#E5E0D8] bg-[#F7F4EF] font-mono text-[10px] uppercase tracking-wider text-[#8A8279]">Item</span><div className="min-w-0"><p className="truncate text-sm font-extrabold text-slate-900">{product.name}</p><p className="mt-0.5 text-xs font-medium text-violet-700">₹{product.price}</p></div></div><button onClick={() => handleDelete(product._id)} className="btn-accent shrink-0 rounded-xl border border-rose-100 bg-rose-50 px-3 py-2 text-xs font-bold text-rose-600 transition hover:border-rose-200 hover:bg-rose-100">Delete</button></div>)}</div>}
          </section>
        </section>
      </main>

      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-sm" onMouseDown={(event) => { if (event.target === event.currentTarget) setSelectedOrder(null) }}>
          <section role="dialog" aria-modal="true" aria-labelledby="order-details-title" className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl md:p-8">
            <div className="flex items-start justify-between gap-4">
              <div><p className="text-xs font-extrabold uppercase tracking-widest text-violet-600">Order details</p><h2 id="order-details-title" className="mt-1 text-2xl font-black text-slate-900">#{selectedOrder._id.slice(-7).toUpperCase()}</h2><p className="mt-1 text-sm text-slate-500">Placed {formatDate(selectedOrder.createdAt)}</p></div>
              <button onClick={() => setSelectedOrder(null)} aria-label="Close order details" className="rounded-xl bg-slate-100 px-3 py-2 font-bold text-slate-600 hover:bg-slate-200">✕</button>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl bg-violet-50 p-4"><p className="text-xs font-extrabold uppercase tracking-wider text-violet-600">Customer</p><p className="mt-2 font-bold text-slate-900">{selectedOrder.customer?.name || "—"}</p><p className="mt-1 text-sm text-slate-600">{selectedOrder.customer?.email || ""}</p><p className="mt-1 text-sm text-slate-600">{selectedOrder.customer?.phone || ""}</p><p className="mt-2 text-sm text-slate-600">{[selectedOrder.customer?.address, selectedOrder.customer?.city].filter(Boolean).join(", ")}</p></div>
              <div className="rounded-2xl bg-slate-50 p-4"><p className="text-xs font-extrabold uppercase tracking-wider text-slate-500">Payment</p><p className="mt-2 font-bold capitalize text-slate-900">{selectedOrder.paymentMethod || "—"} · {selectedOrder.paymentStatus || "pending"}</p><p className="mt-2 text-sm text-slate-600">Order total</p><p className="text-xl font-black text-slate-900">₹{Number(selectedOrder.totalAmount || 0).toLocaleString("en-IN")}</p></div>
            </div>

            <div className="mt-6"><h3 className="mb-3 font-black text-slate-900">Items</h3><div className="divide-y divide-violet-100 rounded-2xl border border-violet-100">{(selectedOrder.items || []).map((item, index) => <div key={item._id || `${item.name}-${index}`} className="flex justify-between gap-4 px-4 py-3 text-sm"><span className="font-semibold text-slate-700">{item.name || "Item"} × {item.qty || item.quantity || 1}</span><span className="font-bold text-slate-900">₹{(Number(item.price) * Number(item.qty || item.quantity || 1)).toLocaleString("en-IN")}</span></div>)}</div></div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><div><p className="text-xs font-extrabold uppercase tracking-wider text-slate-500">Fulfillment status</p><span className={`mt-2 inline-flex rounded-full px-3 py-1.5 text-xs font-bold ring-1 ring-inset ${statusClass(selectedOrder.fulfillmentStatus)}`}>{statusLabel(selectedOrder.fulfillmentStatus)}</span></div><select aria-label="Update fulfillment status" value={selectedOrder.fulfillmentStatus || "new"} disabled={updatingOrderId === selectedOrder._id} onChange={(event) => updateOrderStatus(selectedOrder._id, event.target.value)} className="rounded-xl border border-violet-200 bg-white px-4 py-3 text-sm font-bold text-violet-800 outline-none focus:ring-4 focus:ring-violet-100 disabled:opacity-50">{ORDER_STATUSES.map((status) => <option key={status} value={status}>{statusLabel(status)}</option>)}</select></div>
          </section>
        </div>
      )}
    </div>
  )
}
