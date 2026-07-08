import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { login } from '../utils/api'
import { Coffee } from 'lucide-react'

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await login(form)
      localStorage.setItem('admin_token', res.data.token)
      localStorage.setItem('admin_user', JSON.stringify(res.data.user))
      navigate('/admin')
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg)]">
      <div className="w-full max-w-sm mx-4">
        <div className="card p-8">
          <div className="text-center mb-8">
            <div className="mx-auto mb-4 w-14 h-14 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #e883d4, #cfa5e8)' }}>
              <Coffee size={24} className="text-white" />
            </div>
            <h1 className="text-2xl font-light tracking-wider text-[var(--color-text)]" style={{ fontFamily: "'Poppins', sans-serif" }}>PILATEA</h1>
            <p className="text-sm text-[var(--color-text-muted)] mt-1">Sign in to your admin dashboard</p>
          </div>
          {error && <div className="mb-5 rounded-lg px-4 py-3 text-sm bg-red-50 text-red-700 border border-red-100">{error}</div>}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-medium text-[var(--color-text)] mb-1.5">Email</label>
              <input type="email" required autoFocus value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--color-text)] mb-1.5">Password</label>
              <input type="password" required value={form.password} onChange={e => setForm({...form, password: e.target.value})} />
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full justify-center">
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
