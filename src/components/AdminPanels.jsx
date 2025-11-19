import { useEffect, useState } from 'react'

const API = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

export function AdminProducts({ token }) {
  const [list, setList] = useState([])
  const [form, setForm] = useState({ name: '', description: '', price: 0, category: 'cakes', stock_qty: 0, image_url: '' })

  const headers = { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }

  const load = async () => {
    const res = await fetch(`${API}/products`)
    setList(await res.json())
  }
  useEffect(() => { load() }, [])

  const create = async () => {
    const res = await fetch(`${API}/products`, { method: 'POST', headers, body: JSON.stringify(form) })
    if (res.ok) { setForm({ name: '', description: '', price: 0, category: 'cakes', stock_qty: 0, image_url: '' }); load() }
  }

  const remove = async (id) => {
    await fetch(`${API}/products/${id}`, { method: 'DELETE', headers })
    load()
  }

  return (
    <div className="max-w-6xl mx-auto p-4 grid md:grid-cols-2 gap-6">
      <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-4">
        <h3 className="text-white font-semibold mb-3">Add Product</h3>
        <div className="grid grid-cols-2 gap-3">
          <input placeholder="Name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} className="px-3 py-2 rounded bg-slate-900 border border-slate-700 text-white" />
          <input placeholder="Category" value={form.category} onChange={e=>setForm({...form,category:e.target.value})} className="px-3 py-2 rounded bg-slate-900 border border-slate-700 text-white" />
          <input placeholder="Price" type="number" value={form.price} onChange={e=>setForm({...form,price:parseFloat(e.target.value)})} className="px-3 py-2 rounded bg-slate-900 border border-slate-700 text-white" />
          <input placeholder="Stock" type="number" value={form.stock_qty} onChange={e=>setForm({...form,stock_qty:parseInt(e.target.value||'0')})} className="px-3 py-2 rounded bg-slate-900 border border-slate-700 text-white" />
          <input placeholder="Image URL" value={form.image_url} onChange={e=>setForm({...form,image_url:e.target.value})} className="px-3 py-2 rounded bg-slate-900 border border-slate-700 text-white col-span-2" />
          <textarea placeholder="Description" value={form.description} onChange={e=>setForm({...form,description:e.target.value})} className="px-3 py-2 rounded bg-slate-900 border border-slate-700 text-white col-span-2" />
        </div>
        <button onClick={create} className="mt-3 px-4 py-2 rounded bg-green-600 text-white hover:bg-green-500">Save</button>
      </div>
      <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-4">
        <h3 className="text-white font-semibold mb-3">Products</h3>
        <div className="space-y-3 max-h-[520px] overflow-auto pr-2">
          {list.map(p => (
            <div key={p.id} className="flex items-center justify-between bg-slate-900/60 border border-slate-700 rounded-lg p-3">
              <div>
                <p className="text-white font-medium">{p.name}</p>
                <p className="text-slate-400 text-sm">${p.price} • {p.category} • Stock {p.stock_qty}</p>
              </div>
              <button onClick={()=>remove(p.id)} className="px-3 py-1.5 rounded bg-red-600 text-white">Delete</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export function AdminInventory({ token }) {
  const [list, setList] = useState([])
  const [form, setForm] = useState({ name: '', quantity: 0, unit: 'kg', low_threshold: 0, expiry_date: '' })
  const headers = { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }

  const load = async () => {
    const res = await fetch(`${API}/ingredients`, { headers })
    setList(await res.json())
  }
  useEffect(() => { load() }, [])

  const create = async () => {
    const payload = { ...form, quantity: parseFloat(form.quantity), low_threshold: parseFloat(form.low_threshold), expiry_date: form.expiry_date || null }
    const res = await fetch(`${API}/ingredients`, { method: 'POST', headers, body: JSON.stringify(payload) })
    if (res.ok) { setForm({ name: '', quantity: 0, unit: 'kg', low_threshold: 0, expiry_date: '' }); load() }
  }

  return (
    <div className="max-w-5xl mx-auto p-4 grid md:grid-cols-2 gap-6">
      <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-4">
        <h3 className="text-white font-semibold mb-3">Add Ingredient</h3>
        <div className="grid grid-cols-2 gap-3">
          <input placeholder="Name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} className="px-3 py-2 rounded bg-slate-900 border border-slate-700 text-white" />
          <input placeholder="Quantity" type="number" value={form.quantity} onChange={e=>setForm({...form,quantity:e.target.value})} className="px-3 py-2 rounded bg-slate-900 border border-slate-700 text-white" />
          <input placeholder="Unit" value={form.unit} onChange={e=>setForm({...form,unit:e.target.value})} className="px-3 py-2 rounded bg-slate-900 border border-slate-700 text-white" />
          <input placeholder="Low threshold" type="number" value={form.low_threshold} onChange={e=>setForm({...form,low_threshold:e.target.value})} className="px-3 py-2 rounded bg-slate-900 border border-slate-700 text-white" />
          <input placeholder="Expiry (YYYY-MM-DD)" value={form.expiry_date} onChange={e=>setForm({...form,expiry_date:e.target.value})} className="px-3 py-2 rounded bg-slate-900 border border-slate-700 text-white col-span-2" />
        </div>
        <button onClick={create} className="mt-3 px-4 py-2 rounded bg-green-600 text-white hover:bg-green-500">Save</button>
      </div>
      <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-4">
        <h3 className="text-white font-semibold mb-3">Inventory</h3>
        <div className="space-y-3 max-h-[520px] overflow-auto pr-2">
          {list.map(it => (
            <div key={it.id} className="flex items-center justify-between bg-slate-900/60 border border-slate-700 rounded-lg p-3">
              <div>
                <p className="text-white font-medium">{it.name}</p>
                <p className="text-slate-400 text-sm">{it.quantity} {it.unit} • Low @ {it.low_threshold} • Exp {it.expiry_date?.slice?.(0,10) || '—'}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export function AdminReports({ token }) {
  const [sales, setSales] = useState(null)
  const [inv, setInv] = useState(null)
  const headers = { Authorization: `Bearer ${token}` }

  useEffect(() => {
    fetch(`${API}/reports/sales`, { headers }).then(r=>r.json()).then(setSales)
    fetch(`${API}/reports/inventory`, { headers }).then(r=>r.json()).then(setInv)
  }, [])

  return (
    <div className="max-w-4xl mx-auto p-4 grid md:grid-cols-2 gap-6">
      <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-4">
        <h3 className="text-white font-semibold mb-3">Sales</h3>
        {sales && (
          <div className="text-slate-300 space-y-2">
            <p>Total Orders: <span className="text-white font-semibold">{sales.total_orders}</span></p>
            <p>Total Revenue: <span className="text-white font-semibold">${sales.total_revenue}</span></p>
            <div>
              <p className="text-slate-400 text-sm mb-1">Top Products</p>
              <ul className="list-disc ml-5">
                {sales.top_products.map((p, i) => (
                  <li key={i}>{p.product_id} • Qty {p.qty}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
      <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-4">
        <h3 className="text-white font-semibold mb-3">Inventory</h3>
        {inv && (
          <div className="text-slate-300 space-y-2">
            <p>Total Products: <span className="text-white font-semibold">{inv.total_products}</span></p>
            <p>Low Stock Ingredients: <span className="text-white font-semibold">{inv.low_stock_ingredients}</span></p>
          </div>
        )}
      </div>
    </div>
  )
}
