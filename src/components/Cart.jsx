export default function Cart({ items, onCheckout }) {
  const subtotal = items.reduce((s, it) => s + it.price * it.qty, 0)
  const tax = Math.round(subtotal * 0.05 * 100) / 100
  const total = Math.round((subtotal + tax) * 100) / 100

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h2 className="text-white text-xl font-semibold mb-3">Your Cart</h2>
      <div className="bg-slate-800/60 border border-slate-700 rounded-xl divide-y divide-slate-700">
        {items.length === 0 && <p className="p-4 text-slate-300">Your cart is empty.</p>}
        {items.map((it, idx) => (
          <div key={idx} className="p-4 flex items-center justify-between">
            <div>
              <p className="text-white">{it.name}</p>
              <p className="text-slate-400 text-sm">Qty: {it.qty}</p>
            </div>
            <div className="text-blue-300 font-semibold">${(it.price * it.qty).toFixed(2)}</div>
          </div>
        ))}
      </div>
      <div className="mt-4 p-4 bg-slate-800/60 border border-slate-700 rounded-xl">
        <div className="flex items-center justify-between text-slate-300"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
        <div className="flex items-center justify-between text-slate-300"><span>Tax</span><span>${tax.toFixed(2)}</span></div>
        <div className="flex items-center justify-between text-white font-semibold mt-2"><span>Total</span><span>${total.toFixed(2)}</span></div>
        <button onClick={() => onCheckout(total)} className="mt-4 w-full px-4 py-2 rounded bg-green-600 text-white hover:bg-green-500">Checkout</button>
      </div>
    </div>
  )
}
