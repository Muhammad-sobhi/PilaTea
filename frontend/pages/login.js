import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const { login } = useAuth()
  const router = useRouter()
  const { redirect } = router.query
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      await login(form)
      router.push(redirect || '/')
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="page min-h-screen flex items-center justify-center">
      <div className="glass-card w-full max-w-md p-10" data-aos="fade-up">
        <div className="text-center mb-8">
          <img src="/Untitled.png" alt="PILATEA" className="h-12 mx-auto mb-4" />
          <h1 className="text-2xl font-bold font-poppins">Welcome Back</h1>
          <p className="text-sm opacity-60 mt-1">Sign in to book a session</p>
        </div>

        {error && (
          <p className="mb-4 p-3 rounded-xl text-sm bg-red-50 text-red-600">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-semibold block mb-1">Email</label>
            <input type="email" required value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              className="w-full p-3 rounded-xl bg-white/60 border border-white/80 outline-none" />
          </div>
          <div>
            <label className="text-sm font-semibold block mb-1">Password</label>
            <input type="password" required value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              className="w-full p-3 rounded-xl bg-white/60 border border-white/80 outline-none" />
          </div>
          <button type="submit" disabled={submitting}
            className="btn w-full disabled:opacity-50">
            {submitting ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="text-sm text-center mt-6 opacity-60">
          Don&apos;t have an account?{' '}
          <Link href={`/register${redirect ? `?redirect=${redirect}` : ''}`}
            className="text-[#d071c7] font-semibold hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  )
}
