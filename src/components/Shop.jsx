import { useEffect, useState } from 'react'

const API = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

export default function Shop({ token, onAddToCart }) {
  const [products, setProducts] = useState([])

  useEffect(() => {
    fetch(`${API}/products`).then(r=>r.json()).then(setProducts)
  }, [])

  return (
    <div className="max-w-6xl mx-auto p-4 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map(p => (
        <div key={p.id} className="bg-slate-800/60 border border-slate-700 rounded-xl overflow-hidden">
          {p.image_url && <img src={p.image_url} alt={p.name} className="w-full h-44 object-cover" />}
          <div className="p-4">
            <h3 className="text-white font-semibold">{p.name}</h3>
            <p className="text-slate-300 text-sm line-clamp-2">{p.description}</p>
            <div className="mt-3 flex items-center justify-between">
              <span className="text-blue-300 font-semibold">${p.price?.toFixed?.(2) ?? p.price}</span>
              <button onClick={() => onAddToCart(p)} className="px-3 py-1.5 rounded bg-blue-600 text-white hover:bg-blue-500 text-sm">Add</button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
