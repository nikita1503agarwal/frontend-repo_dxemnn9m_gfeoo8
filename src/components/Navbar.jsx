import { useState } from 'react'

export default function Navbar({ onNavigate, user, onLogout }) {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 backdrop-blur bg-slate-900/70 border-b border-slate-700/50">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <div onClick={() => onNavigate('home')} className="text-white font-bold text-xl cursor-pointer">BakeryPro</div>
        <nav className="hidden md:flex gap-6 text-slate-200">
          <button onClick={() => onNavigate('shop')} className="hover:text-white">Shop</button>
          <button onClick={() => onNavigate('orders')} className="hover:text-white">My Orders</button>
          <button onClick={() => onNavigate('support')} className="hover:text-white">Support</button>
          {user?.role === 'admin' && (
            <>
              <button onClick={() => onNavigate('admin-products')} className="hover:text-white">Products</button>
              <button onClick={() => onNavigate('admin-inventory')} className="hover:text-white">Inventory</button>
              <button onClick={() => onNavigate('admin-reports')} className="hover:text-white">Reports</button>
            </>
          )}
        </nav>
        <div className="flex items-center gap-3">
          {user ? (
            <>
              <span className="hidden md:inline text-slate-300">Hi, {user.name.split(' ')[0]}</span>
              <button onClick={onLogout} className="px-3 py-1.5 rounded-md bg-red-600 text-white hover:bg-red-500 text-sm">Logout</button>
            </>
          ) : (
            <button onClick={() => onNavigate('auth')} className="px-3 py-1.5 rounded-md bg-blue-600 text-white hover:bg-blue-500 text-sm">Login</button>
          )}
          <button className="md:hidden text-slate-200" onClick={() => setOpen(!open)}>Menu</button>
        </div>
      </div>
      {open && (
        <div className="md:hidden px-4 pb-3 space-y-2">
          <button onClick={() => onNavigate('shop')} className="block w-full text-left text-slate-200">Shop</button>
          <button onClick={() => onNavigate('orders')} className="block w-full text-left text-slate-200">My Orders</button>
          <button onClick={() => onNavigate('support')} className="block w-full text-left text-slate-200">Support</button>
          {user?.role === 'admin' && (
            <>
              <button onClick={() => onNavigate('admin-products')} className="block w-full text-left text-slate-200">Products</button>
              <button onClick={() => onNavigate('admin-inventory')} className="block w-full text-left text-slate-200">Inventory</button>
              <button onClick={() => onNavigate('admin-reports')} className="block w-full text-left text-slate-200">Reports</button>
            </>
          )}
        </div>
      )}
    </header>
  )
}
