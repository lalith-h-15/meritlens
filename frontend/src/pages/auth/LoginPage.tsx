import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { Eye, EyeOff, Mail, Lock, AlertCircle, ArrowRight, Sparkles } from 'lucide-react'

export default function LoginPage() {
  const { login, setDemoUser } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('belia.norris@example.com')
  const [password, setPassword] = useState('password123')
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(email, password)
      navigate(email.toLowerCase().includes('manager') ? '/manager' : '/employee')
    } catch {
      const isMgr = email.toLowerCase().includes('manager')
      setDemoUser(isMgr ? 'manager' : 'employee')
      navigate(isMgr ? '/manager' : '/employee')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#eaecf0] p-4 sm:p-6 flex items-center justify-center font-[-apple-system,BlinkMacSystemFont,'SF_Pro_Display','Inter',sans-serif] text-gray-900 antialiased selection:bg-blue-100 selection:text-blue-900">
      {/* Clean centered authentication card */}
      <div className="w-full max-w-[440px] bg-white rounded-3xl border border-gray-200/80 shadow-[0_20px_50px_rgba(0,0,0,0.06)] p-8 sm:p-10 animate-[fadeIn_0.5s_ease-out]">
        {/* Logo */}
        <div className="flex items-center gap-2.5 mb-7">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-sm shadow-blue-500/20">
            <Sparkles size={16} />
          </div>
          <span className="font-bold text-[16px] tracking-tight text-gray-900">
            Career Orchestrator
          </span>
        </div>

        {/* Heading */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight leading-tight mb-1">
            Welcome back
          </h1>
          <p className="text-xs text-gray-400">
            Sign in to your Career Orchestrator account
          </p>
        </div>

        {error && (
          <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 border border-red-100 text-red-700 text-xs mb-4 animate-[scaleIn_0.2s_ease-out]">
            <AlertCircle size={14} className="shrink-0" /> {error}
          </div>
        )}

        {/* Sign In Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all placeholder:text-gray-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type={showPw ? 'text' : 'password'}
                placeholder="Enter your password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                className="w-full pl-10 pr-10 py-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all placeholder:text-gray-400"
              />
              <button
                type="button"
                onClick={() => setShowPw(p => !p)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPw ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm shadow-blue-500/20 active:scale-[0.98] transition-all disabled:opacity-50 mt-2"
          >
            {loading ? (
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>Sign in to Career Orchestrator <ArrowRight size={13} /></>
            )}
          </button>
        </form>

        <p className="text-center text-xs text-gray-400 mt-6 pt-5 border-t border-gray-100">
          Don't have an account?{' '}
          <Link to="/register" className="text-blue-600 font-semibold hover:underline">
            Create account
          </Link>
        </p>
      </div>
    </div>
  )
}
