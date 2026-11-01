import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { LayoutDashboard, Users, GitBranch, Eye, History, LogOut, Menu, X, Plus, Search, Bell, Info, ChevronDown, Sparkles } from 'lucide-react'
import { useState } from 'react'
import clsx from 'clsx'

const nav = [
  { to: '/manager',              label: 'Dashboard',            icon: LayoutDashboard, end: true },
  { to: '/manager/employees',    label: 'Employee Reviews',      icon: Users },
  { to: '/manager/orchestrator', label: 'Orchestrator Reviews',  icon: GitBranch },
  { to: '/manager/findings',    label: 'Review Findings',       icon: Eye },
  { to: '/manager/history',      label: 'Review History',        icon: History },
]

export default function ManagerLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)

  const handleLogout = () => { logout(); navigate('/login') }

  const initials = user?.name?.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2) || 'MG'

  return (
    <div className="min-h-screen bg-[#eaecf0] p-2 sm:p-4 lg:p-6 font-[-apple-system,BlinkMacSystemFont,'SF_Pro_Display','Inter',sans-serif] text-gray-900 antialiased selection:bg-blue-100 selection:text-blue-900">
      {/* Outer rounded application window */}
      <div className="bg-white rounded-3xl border border-gray-200/80 shadow-[0_20px_50px_rgba(0,0,0,0.06)] overflow-hidden flex min-h-[calc(100vh-2rem)] sm:min-h-[calc(100vh-3rem)]">
        
        {/* Mobile overlay */}
        {open && (
          <div
            className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm lg:hidden"
            onClick={() => setOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside className={clsx(
          'fixed inset-y-0 left-0 z-50 flex flex-col w-[240px] bg-white border-r border-gray-200/80 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] lg:static lg:translate-x-0',
          open ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
        )}>
          {/* Logo Header */}
          <div className="flex items-center justify-between px-5 py-5 border-b border-gray-100">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/manager')}>
              <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-sm shadow-blue-500/20">
                <Sparkles size={15} />
              </div>
              <span className="font-bold text-[15px] tracking-tight text-gray-900">
                Career <span className="text-blue-600">Orchestrator</span>
              </span>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M9 3v18"/></svg>
            </button>
          </div>

          {/* Quick action button */}
          <div className="px-3.5 pt-3 pb-2">
            <button
              onClick={() => navigate('/manager/orchestrator')}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-gray-900 hover:bg-black text-white text-[12px] font-semibold transition-all shadow-sm"
            >
              <Plus size={14} />
              New Review Session
            </button>
          </div>

          {/* Nav */}
          <nav className="flex-1 overflow-y-auto px-3.5 py-2 space-y-1">
            <div className="px-2.5 mb-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
              Management Portal
            </div>
            {nav.map(({ to, label, icon: Icon, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                onClick={() => setOpen(false)}
                className={({ isActive }) => clsx(
                  'flex items-center gap-2.5 px-3 py-2 rounded-xl text-[13px] font-medium transition-colors',
                  isActive
                    ? 'bg-blue-50/80 text-blue-700 font-semibold'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                )}
              >
                {({ isActive }) => (
                  <>
                    <Icon size={15} className={isActive ? 'text-blue-600' : 'text-gray-400'} />
                    <span>{label}</span>
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          {/* Bottom Card & Sign Out */}
          <div className="p-3 border-t border-gray-100 space-y-2.5">
            <div className="bg-[#f8faff] rounded-2xl border border-blue-100/80 p-3.5">
              <div className="font-bold text-[12px] text-gray-900 mb-0.5">Manager Active</div>
              <div className="text-[11px] text-gray-500 leading-tight">
                Review queue loaded with real-time audit logging.
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="w-full py-2 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 text-[12px] font-semibold transition-colors flex items-center justify-center gap-1.5"
            >
              Sign Out
            </button>
          </div>
        </aside>

        {/* ── Main Workspace ──────────────────────────────────────── */}
        <div className="flex-1 flex flex-col min-w-0 bg-white">
          {/* Top Bar */}
          <header className="px-6 sm:px-8 pt-6 pb-4 flex items-center justify-between border-b border-gray-100">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setOpen(true)}
                className="lg:hidden w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50"
              >
                <Menu size={16} />
              </button>
              <div>
                <h1 className="text-[18px] sm:text-[20px] font-bold text-gray-900 tracking-tight leading-snug">
                  Manager Oversight Console
                </h1>
                <p className="text-[12px] sm:text-[13px] text-gray-400">
                  Verify performance claims, review orchestrator runs, and resolve discrepancies.
                </p>
              </div>
            </div>

            {/* Top Right Actions */}
            <div className="flex items-center gap-2.5">
              <button className="w-9 h-9 rounded-xl border border-gray-200 flex items-center justify-center text-gray-500 hover:text-gray-700 hover:border-gray-300 transition-colors">
                <Bell size={15} />
              </button>
              <button className="w-9 h-9 rounded-xl border border-gray-200 flex items-center justify-center text-gray-500 hover:text-gray-700 hover:border-gray-300 transition-colors">
                <Info size={15} />
              </button>

              {/* User Profile Pill */}
              <div className="flex items-center gap-2 pl-1 pr-2.5 py-1 rounded-full border border-gray-200 hover:border-gray-300 cursor-pointer transition-colors">
                <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-white text-[11px] font-bold shadow-sm">
                  {initials}
                </div>
                <span className="text-[12px] font-semibold text-gray-800 hidden sm:inline">
                  {user?.name || 'Marcus Vance'}
                </span>
                <ChevronDown size={12} className="text-gray-400" />
              </div>
            </div>
          </header>

          {/* Page Content */}
          <main className="flex-1 overflow-y-auto px-6 sm:px-8 py-6">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  )
}
