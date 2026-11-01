import React, { createContext, useContext, useEffect, useState } from 'react'
import { authAPI } from '../lib/api'

export interface User {
  id: string
  name: string
  email: string
  role: 'employee' | 'manager'
  careerGoal?: string
  headline?: string
  department?: string
}

interface AuthCtx {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (data: { name: string; email: string; password: string; careerGoal?: string }) => Promise<void>
  logout: () => void
  setDemoUser: (role?: 'employee' | 'manager') => void
}

const DEFAULT_DEMO_USER: User = {
  id: 'belia-norris-1',
  name: 'Belia Norris',
  email: 'belia.norris@example.com',
  role: 'employee',
  headline: 'SAP S/4HANA Solutions Lead',
  department: 'Finance & Supply Chain',
  careerGoal: 'Principal Solutions Architect',
}

const AuthContext = createContext<AuthCtx>({} as AuthCtx)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // Initialize with DEFAULT_DEMO_USER so the UI is immediately visible even without backend
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('demo_user')
    if (saved) {
      try { return JSON.parse(saved) } catch { /* ignore */ }
    }
    return DEFAULT_DEMO_USER
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      // If no token exists, keep default demo user so user is never locked out
      if (!user) {
        setUser(DEFAULT_DEMO_USER)
      }
      setLoading(false)
      return
    }

    authAPI.me()
      .then((r) => {
        const u = r.data.user ?? r.data
        setUser(u)
        localStorage.setItem('demo_user', JSON.stringify(u))
      })
      .catch(() => {
        // If backend fails or token is invalid, fallback gracefully to demo user
        if (!user) {
          setUser(DEFAULT_DEMO_USER)
        }
      })
      .finally(() => setLoading(false))
  }, [])

  const login = async (email: string, password: string) => {
    try {
      const r = await authAPI.login(email, password)
      const { token, user: u } = r.data
      localStorage.setItem('token', token)
      setUser(u)
      localStorage.setItem('demo_user', JSON.stringify(u))
    } catch (err) {
      console.warn('Backend unavailable, using local session:', err)
      const isMgr = email.toLowerCase().includes('manager')
      const mock: User = {
        id: 'user-' + Date.now(),
        name: isMgr ? 'Marcus Vance' : (email.split('@')[0] || 'Belia Norris'),
        email: email || 'belia.norris@example.com',
        role: isMgr ? 'manager' : 'employee',
        headline: isMgr ? 'Engineering Director' : 'SAP S/4HANA Solutions Lead',
        department: 'Operations & Technology',
        careerGoal: 'Principal Architect',
      }
      localStorage.setItem('token', 'demo-token-' + Date.now())
      setUser(mock)
      localStorage.setItem('demo_user', JSON.stringify(mock))
    }
  }

  const register = async (data: { name: string; email: string; password: string; careerGoal?: string }) => {
    try {
      const r = await authAPI.register(data)
      const { token, user: u } = r.data
      localStorage.setItem('token', token)
      setUser(u)
      localStorage.setItem('demo_user', JSON.stringify(u))
    } catch (err) {
      console.warn('Backend unavailable, creating local demo profile:', err)
      const mock: User = {
        id: 'user-' + Date.now(),
        name: data.name || 'Belia Norris',
        email: data.email || 'belia.norris@example.com',
        role: 'employee',
        headline: 'Career Explorer',
        department: data.careerGoal || 'Enterprise Software',
        careerGoal: data.careerGoal || 'Full-Stack Lead',
      }
      localStorage.setItem('token', 'demo-token-' + Date.now())
      setUser(mock)
      localStorage.setItem('demo_user', JSON.stringify(mock))
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('demo_user')
    setUser(null)
  }

  const setDemoUser = (role: 'employee' | 'manager' = 'employee') => {
    const demo: User = role === 'manager'
      ? {
          id: 'manager-demo',
          name: 'Marcus Vance',
          email: 'marcus.vance@example.com',
          role: 'manager',
          headline: 'VP of Engineering',
          department: 'Core Infrastructure',
        }
      : DEFAULT_DEMO_USER

    localStorage.setItem('token', 'demo-token')
    localStorage.setItem('demo_user', JSON.stringify(demo))
    setUser(demo)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, setDemoUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
