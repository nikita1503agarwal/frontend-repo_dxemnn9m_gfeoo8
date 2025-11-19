import { useEffect, useState } from 'react'
import Navbar from './components/Navbar'
import Auth from './components/Auth'
import Shop from './components/Shop'
import Cart from './components/Cart'
import { AdminProducts, AdminInventory, AdminReports } from './components/AdminPanels'

const API = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

function App() {
  const [route, setRoute] = useState('home')
  const [auth, setAuth] = useState(() => ({ token: localStorage.getItem('token') || null, user: JSON.parse(localStorage.getItem('user') || 'null') }))
  const [cart, setCart] = useState([])

  const onAuthed = ({ token, user }) => {
    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(user))
    setAuth({ token, user })
    setRoute('shop')
  }

  const onLogout = () => {
    localStorage.removeItem('token'); localStorage.removeItem('user'); setAuth({ token: null, user: null })
  }

  const addToCart = (p) => {
    setCart(prev => {
      const idx = prev.findIndex(it => it.id === p.id)
      if (idx >= 0) { const copy = [...prev]; copy[idx].qty += 1; return copy }
      return [...prev, { id: p.id, name: p.name, price: p.price, qty: 1 }]
    })
  }

  const checkout = async (total) => {
    if (!auth.token) { setRoute('auth'); return }
    const items = cart.map(it => ({ product_id: it.id, quantity: it.qty }))
    const res = await fetch(`${API}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${auth.token}` },
      body: JSON.stringify({ items, delivery_mode: 'delivery', payment_method: 'cod' })
    })
    if (res.ok) {
      setCart([])
      alert('Order placed!')
      setRoute('orders')
    } else {
      const j = await res.json(); alert(j.detail || 'Failed')
    }
  }

  const Orders = () => {
    const [list, setList] = useState([])
    useEffect(() => {
      if (!auth.token) return
      fetch(`${API}/orders/me`, { headers: { Authorization: `Bearer ${auth.token}` } }).then(r=>r.json()).then(setList)
    }, [auth.token])

    return (
      <div className="max-w-4xl mx-auto p-4 space-y-3">
        <h2 className="text-white text-xl font-semibold">My Orders</h2>
        {list.map(o => (
          <div key={o.id} className="bg-slate-800/60 border border-slate-700 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <p className="text-white font-medium">{o.order_id}</p>
              <span className="text-slate-300 text-sm">{o.status}</span>
            </div>
            <ul className="text-slate-300 text-sm list-disc ml-5 mt-2">
              {o.items.map((it, i) => (
                <li key={i}>{it.name} x {it.quantity} • ${it.unit_price}</li>
              ))}
            </ul>
            <div className="text-white font-semibold mt-2">Total: ${o.total}</div>
          </div>
        ))}
      </div>
    )
  }

  const Support = () => {
    const [name, setName] = useState(auth.user?.name || '')
    const [email, setEmail] = useState(auth.user?.email || '')
    const [message, setMessage] = useState('')
    const [sent, setSent] = useState(false)
    const submit = async () => {
      const res = await fetch(`${API}/support`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name, email, message, user_id: auth.user?.id }) })
      if (res.ok) setSent(true)
    }

    return (
      <div className="max-w-xl mx-auto p-4">
        <h2 className="text-white text-xl font-semibold mb-3">Contact Support</h2>
        {sent ? <p className="text-green-400">Thanks! We will get back to you soon.</p> : (
          <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-4 space-y-3">
            <input placeholder="Name" value={name} onChange={e=>setName(e.target.value)} className="w-full px-3 py-2 rounded bg-slate-900 border border-slate-700 text-white" />
            <input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} className="w-full px-3 py-2 rounded bg-slate-900 border border-slate-700 text-white" />
            <textarea placeholder="Message" value={message} onChange={e=>setMessage(e.target.value)} className="w-full px-3 py-2 rounded bg-slate-900 border border-slate-700 text-white min-h-[120px]" />
            <button onClick={submit} className="px-4 py-2 rounded bg-blue-600 text-white">Send</button>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Navbar onNavigate={setRoute} user={auth.user} onLogout={onLogout} />
      <div className="pt-6 pb-20">
        {route === 'home' && (
          <div className="max-w-4xl mx-auto p-6 text-center">
            <h1 className="text-4xl font-bold text-white mb-3">Delightful Bakery Management</h1>
            <p className="text-slate-300">Manage users, products, inventory, orders, billing and reports in one place.</p>
            <div className="mt-6 flex items-center justify-center gap-3">
              <button onClick={()=>setRoute('shop')} className="px-4 py-2 rounded bg-blue-600 text-white">Start Shopping</button>
              <button onClick={()=>setRoute('auth')} className="px-4 py-2 rounded bg-slate-700 text-white">Sign in</button>
            </div>
          </div>
        )}

        {route === 'auth' && <Auth onAuthed={onAuthed} />}

        {route === 'shop' && (
          <>
            <Shop token={auth.token} onAddToCart={addToCart} />
            <div className="max-w-6xl mx-auto p-4">
              <Cart items={cart} onCheckout={checkout} />
            </div>
          </>
        )}

        {route === 'orders' && <Orders />}

        {auth.user?.role === 'admin' && route === 'admin-products' && <AdminProducts token={auth.token} />}
        {auth.user?.role === 'admin' && route === 'admin-inventory' && <AdminInventory token={auth.token} />}
        {auth.user?.role === 'admin' && route === 'admin-reports' && <AdminReports token={auth.token} />}

        {route === 'support' && <Support />}
      </div>
    </div>
  )
}

export default App
