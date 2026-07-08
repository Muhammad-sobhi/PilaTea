import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/router'
import { login as apiLogin, register as apiRegister, logout as apiLogout, getUser } from '../utils/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('customer_token')
    if (token) {
      getUser()
        .then(res => setUser(res.data || res))
        .catch(() => localStorage.removeItem('customer_token'))
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  const login = useCallback(async (data) => {
    const res = await apiLogin(data)
    localStorage.setItem('customer_token', res.token)
    setUser(res.user)
    return res
  }, [])

  const register = useCallback(async (data) => {
    const res = await apiRegister(data)
    localStorage.setItem('customer_token', res.token)
    setUser(res.user)
    return res
  }, [])

  const logout = useCallback(async () => {
    try { await apiLogout() } catch {}
    localStorage.removeItem('customer_token')
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
