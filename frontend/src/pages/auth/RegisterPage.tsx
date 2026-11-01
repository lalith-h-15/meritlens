import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { Eye, EyeOff, Mail, Lock, User, Briefcase, AlertCircle, ArrowRight, CheckCircle2, Sparkles } from 'lucide-react'

export default function RegisterPage() {
  const { register, setDemoUser } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({
    name: 'Belia Norris',
    email: 'belia.norris@example.com',
    password: 'password123',
    role: 'employee' as 'employee' | 'manager',
    department: 'Finance & Cloud ERP'
  })
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await register({
        name: form.name,
        email: form.email,
        password: form.password,
        careerGoal: form.department,
      })
      navigate(form.role === 'manager' ? '/manager' : '/employee')
    } catch {
      setDemoUser(form.role)
      navigate(form.role === 'manager' ? '/manager' : '/employee')
    } finally {
      setLoading(false)
    }
  }

  const pwRules = [
    { label: '8+ chars', met: form.password.length >= 8 },
    { label: 'Uppercase', met: /[A-Z]/.test(form.password) },
    { label: 'Number', met: /[0-9]/.test(form.password) },
  ]

  return (
    <div className="min-h-screen bg-[#eaecf0] p-4 sm:p-6 flex items-center justify-center font-[-apple-system,BlinkMacSystemFont,'SF_Pro_Display','Inter',sans-serif] text-gray-900 antialiased selection:bg-blue-100 selection:text-blue-900">
      {/* Clean centered registration card */}
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
            Create account
          </h1>
          <p className="text-xs text-gray-400">
            Get started with your AI career companion
          </p>
        </div>

        {error && (
          <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 border border-red-100 text-red-700 text-xs mb-4 animate-[scaleIn_0.2s_ease-out]">
            <AlertCircle size={14} className="shrink-0" /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">
              Full Name
            </label>
            <div className="relative">
              <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Full name"
                value={form.name}
                onChange={set('name')}
                required
                className="w-full pl-10 pr-4 py-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all placeholder:text-gray-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                placeholder="Email address"
                value={form.email}
                onChange={set('email')}
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
                placeholder="Password"
                value={form.password}
                onChange={set('password')}
                required
                className="w-full pl-10 pr-10 py-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all placeholder:text-gray-400"
              />
              <button type="button" onClick={() => setShowPw(p => !p)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                {showPw ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
          </div>

          {form.password && (
            <div className="flex gap-2 px-1">
              {pwRules.map(r => (
                <div key={r.label} className={`flex items-center gap-1 text-[10px] transition-colors ${r.met ? 'text-emerald-600' : 'text-gray-400'}`}>
                  <CheckCircle2 size={11} className={r.met ? 'text-emerald-500' : 'text-gray-300'} />
                  <span>{r.label}</span>
                </div>
              ))}
            </div>
          )}

          <div>
            <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">
              Department
            </label>
            <div className="relative">
              <Briefcase size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="e.g. Finance & Cloud ERP"
                value={form.department}
                onChange={set('department')}
                className="w-full pl-10 pr-4 py-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all placeholder:text-gray-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1">
            {(['employee', 'manager'] as const).map(r => (
              <button
                key={r}
                type="button"
                onClick={() => setForm(f => ({ ...f, role: r }))}
                className={`py-2 rounded-xl text-xs font-semibold border transition-all capitalize ${
                  form.role === r
                    ? 'bg-blue-600 text-white border-blue-600 shadow-sm shadow-blue-500/20'
                    : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                }`}
              >
                {r}
              </button>
            ))}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm shadow-blue-500/20 active:scale-[0.98] transition-all disabled:opacity-50 mt-2"
          >
            {loading ? (
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>Create Career Orchestrator Account <ArrowRight size={13} /></>
            )}
          </button>
        </form>

        <p className="text-center text-xs text-gray-400 mt-5 pt-4 border-t border-gray-100">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-600 font-semibold hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
