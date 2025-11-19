import { useState } from 'react'

const API = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

export default function Auth({ onAuthed }) {
  const [isRegister, setIsRegister] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [role, setRole] = useState('customer')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const doRegister = async () => {
    setLoading(true); setError('')
    try {
      const res = await fetch(`${API}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role })
      })
      if (!res.ok) throw new Error((await res.json()).detail || 'Registration failed')
      // After registration, login
      await doLogin()
    } catch (e) { setError(e.message) } finally { setLoading(false) }
  }

  const doLogin = async () => {
    setLoading(true); setError('')
    try {
      const form = new URLSearchParams()
      form.append('username', email)
      form.append('password', password)
      const res = await fetch(`${API}/auth/login`, { method: 'POST', body: form })
      if (!res.ok) throw new Error((await res.json()).detail || 'Login failed')
      const data = await res.json()
      const me = await fetch(`${API}/auth/me`, { headers: { Authorization: `Bearer ${data.access_token}` } })
      const user = await me.json()
      onAuthed({ token: data.access_token, user })
    } catch (e) { setError(e.message) } finally { setLoading(false) }
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-slate-800/60 rounded-xl border border-slate-700">
      <h2 className="text-white font-semibold text-xl mb-4">{isRegister ? 'Create account' : 'Welcome back'}</h2>
      {isRegister && (
        <div className="mb-3">
          <label className="block text-slate-300 text-sm mb-1">Name</label>
          <input value={name} onChange={e=>setName(e.target.value)} className="w-full px-3 py-2 rounded bg-slate-900 border border-slate-700 text-white" />
        </div>
      )}
      <div className="mb-3">
        <label className="block text-slate-300 text-sm mb-1">Email</label>
        <input value={email} onChange={e=>setEmail(e.target.value)} className="w-full px-3 py-2 rounded bg-slate-900 border border-slate-700 text-white" />
      </div>
      <div className="mb-4">
        <label className="block text-slate-300 text-sm mb-1">Password</label>
        <input type="password" value={password} onChange={e=>setPassword(e.target.value)} className="w-full px-3 py-2 rounded bg-slate-900 border border-slate-700 text-white" />
      </div>
      {isRegister && (
        <div className="mb-4">
          <label className="block text-slate-300 text-sm mb-1">Role</label>
          <select value={role} onChange={e=>setRole(e.target.value)} className="w-full px-3 py-2 rounded bg-slate-900 border border-slate-700 text-white">
            <option value="customer">Customer</option>
            <option value="admin">Admin</option>
          </select>
        </div>
      )}
      {error && <p className="text-red-400 text-sm mb-2">{error}</p>}
      <div className="flex items-center gap-3">
        {!isRegister && <button onClick={doLogin} disabled={loading} className="px-4 py-2 rounded bg-blue-600 text-white disabled:opacity-60">Login</button>}
        {isRegister && <button onClick={doRegister} disabled={loading} className="px-4 py-2 rounded bg-green-600 text-white disabled:opacity-60">Create account</button>}
        <button onClick={()=>setIsRegister(!isRegister)} className="text-slate-300 text-sm">
          {isRegister ? 'Have an account? Sign in' : 'New here? Create account'}
        </button>
      </div>
    </div>
  )
}
