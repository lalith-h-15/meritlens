import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
  LayoutDashboard, Star, Briefcase, BarChart2,
  BookOpen, Target, Award, Shield, FileText, LogOut, Menu, X,
  Search, Settings, HelpCircle, User, Plus,
  TrendingUp, Clock, Library, Plug, Users, Database, ScrollText, Activity,
  Bell, ChevronDown, Info, Sparkles, MessageSquare, Video, FileCheck, Layers
} from 'lucide-react'
import { useState } from 'react'
import clsx from 'clsx'

export default function EmployeeLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [dashboardExpanded, setDashboardExpanded] = useState(true)
  const [coursesExpanded, setCoursesExpanded] = useState(true)

  const handleLogout = () => { logout(); navigate('/login') }

  const firstName = user?.name ? user.name.split(' ')[0] : 'Belia'

  return (
    <div className="min-h-screen bg-[#eaecf0] p-2 sm:p-4 lg:p-6 font-[-apple-system,BlinkMacSystemFont,'SF_Pro_Display','Inter',sans-serif] text-gray-900 antialiased selection:bg-blue-100 selection:text-blue-900">
      {/* Outer rounded application window */}
      <div className="bg-white rounded-3xl border border-gray-200/80 shadow-[0_20px_50px_rgba(0,0,0,0.06)] overflow-hidden flex min-h-[calc(100vh-2rem)] sm:min-h-[calc(100vh-3rem)]">
        
        {/* Mobile backdrop */}
        {open && (
          <div
            className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm lg:hidden"
            onClick={() => setOpen(false)}
          />
        )}

        {/* ── Left Sidebar ────────────────────────────────────────── */}
        <aside className={clsx(
          'fixed inset-y-0 left-0 z-50 flex flex-col w-[240px] bg-white border-r border-gray-200/80 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] lg:static lg:translate-x-0',
          open ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
        )}>
          {/* Logo Header */}
          <div className="flex items-center justify-between px-5 py-5 border-b border-gray-100">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/employee')}>
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
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M9 3v18"/></svg>
            </button>
          </div>

          {/* Navigation Items */}
          <div className="flex-1 overflow-y-auto px-3.5 py-4 space-y-5 scrollbar-none">
            {/* GENERAL MENU */}
            <div>
              <div className="px-2.5 mb-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                General Menu
              </div>

              {/* Collapsible Dashboard Section */}
              <div className="space-y-0.5">
                <div
                  onClick={() => setDashboardExpanded(!dashboardExpanded)}
                  className="flex items-center justify-between px-2.5 py-1.5 rounded-xl text-[13px] font-medium text-gray-700 hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <LayoutDashboard size={15} className="text-gray-500" />
                    <span>Dashboard</span>
                  </div>
                  <span className="text-gray-400 font-bold text-xs">{dashboardExpanded ? '−' : '+'}</span>
                </div>

                {dashboardExpanded && (
                  <div className="pl-6 space-y-0.5 border-l border-gray-100 ml-4 my-1">
                    <NavLink
                      to="/employee"
                      end
                      onClick={() => setOpen(false)}
                      className={({ isActive }) => clsx(
                        'flex items-center justify-between px-2.5 py-1.5 rounded-xl text-[12px] font-medium transition-colors',
                        isActive
                          ? 'bg-blue-50/80 text-blue-700 font-semibold'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      )}
                    >
                      <span>Job Feed</span>
                      <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full min-w-[16px] text-center">
                        8
                      </span>
                    </NavLink>

                    <NavLink
                      to="/employee/roles"
                      onClick={() => setOpen(false)}
                      className={({ isActive }) => clsx(
                        'flex items-center gap-2 px-2.5 py-1.5 rounded-xl text-[12px] font-medium transition-colors',
                        isActive
                          ? 'bg-blue-50/80 text-blue-700 font-semibold'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      )}
                    >
                      <Clock size={13} className="text-gray-400" />
                      <span>Applications History</span>
                    </NavLink>

                    <NavLink
                      to="/employee/reviews"
                      onClick={() => setOpen(false)}
                      className={({ isActive }) => clsx(
                        'flex items-center gap-2 px-2.5 py-1.5 rounded-xl text-[12px] font-medium transition-colors',
                        isActive
                          ? 'bg-blue-50/80 text-blue-700 font-semibold'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      )}
                    >
                      <MessageSquare size={13} className="text-gray-400" />
                      <span>Interview & Review</span>
                    </NavLink>
                  </div>
                )}
              </div>

              {/* Collapsible Courses Section */}
              <div className="space-y-0.5 mt-1.5">
                <div
                  onClick={() => setCoursesExpanded(!coursesExpanded)}
                  className="flex items-center justify-between px-2.5 py-1.5 rounded-xl text-[13px] font-medium text-gray-700 hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <Layers size={15} className="text-gray-500" />
                    <span>Courses</span>
                  </div>
                  <span className="text-gray-400 font-bold text-xs">{coursesExpanded ? '−' : '+'}</span>
                </div>

                {coursesExpanded && (
                  <div className="pl-6 space-y-0.5 border-l border-gray-100 ml-4 my-1">
                    <NavLink
                      to="/employee/skills"
                      onClick={() => setOpen(false)}
                      className={({ isActive }) => clsx(
                        'flex items-center gap-2 px-2.5 py-1.5 rounded-xl text-[12px] font-medium transition-colors',
                        isActive
                          ? 'bg-blue-50/80 text-blue-700 font-semibold'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      )}
                    >
                      <BookOpen size={13} className="text-gray-400" />
                      <span>JobAI Learn</span>
                    </NavLink>

                    <NavLink
                      to="/employee/learning"
                      onClick={() => setOpen(false)}
                      className={({ isActive }) => clsx(
                        'flex items-center gap-2 px-2.5 py-1.5 rounded-xl text-[12px] font-medium transition-colors',
                        isActive
                          ? 'bg-blue-50/80 text-blue-700 font-semibold'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      )}
                    >
                      <FileCheck size={13} className="text-gray-400" />
                      <span>Enrolled Course</span>
                    </NavLink>

                    <NavLink
                      to="/employee/readiness"
                      onClick={() => setOpen(false)}
                      className={({ isActive }) => clsx(
                        'flex items-center gap-2 px-2.5 py-1.5 rounded-xl text-[12px] font-medium transition-colors',
                        isActive
                          ? 'bg-blue-50/80 text-blue-700 font-semibold'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      )}
                    >
                      <Award size={13} className="text-gray-400" />
                      <span>Certificate Feed</span>
                    </NavLink>
                  </div>
                )}
              </div>

              {/* Direct feature items */}
              <div className="space-y-0.5 mt-1.5">
                <NavLink
                  to="/employee/market"
                  onClick={() => setOpen(false)}
                  className={({ isActive }) => clsx(
                    'flex items-center gap-2.5 px-2.5 py-1.5 rounded-xl text-[13px] font-medium transition-colors',
                    isActive
                      ? 'bg-blue-50/80 text-blue-700 font-semibold'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  )}
                >
                  <FileText size={15} className="text-gray-500" />
                  <span>CV Assistant</span>
                </NavLink>

                <NavLink
                  to="/employee/bias"
                  onClick={() => setOpen(false)}
                  className={({ isActive }) => clsx(
                    'flex items-center gap-2.5 px-2.5 py-1.5 rounded-xl text-[13px] font-medium transition-colors',
                    isActive
                      ? 'bg-blue-50/80 text-blue-700 font-semibold'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  )}
                >
                  <Video size={15} className="text-gray-500" />
                  <span>Interview Simulation</span>
                </NavLink>
              </div>
            </div>

            {/* SUPPORT */}
            <div>
              <div className="px-2.5 mb-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                Support
              </div>
              <div className="space-y-0.5">
                <NavLink
                  to="/employee/matching"
                  onClick={() => setOpen(false)}
                  className={({ isActive }) => clsx(
                    'flex items-center gap-2.5 px-2.5 py-1.5 rounded-xl text-[13px] font-medium transition-colors',
                    isActive
                      ? 'bg-blue-50/80 text-blue-700 font-semibold'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  )}
                >
                  <BarChart2 size={15} className="text-gray-500" />
                  <span>Pricing Plan</span>
                </NavLink>

                <NavLink
                  to="/employee/roles"
                  onClick={() => setOpen(false)}
                  className={({ isActive }) => clsx(
                    'flex items-center gap-2.5 px-2.5 py-1.5 rounded-xl text-[13px] font-medium transition-colors',
                    isActive
                      ? 'bg-blue-50/80 text-blue-700 font-semibold'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  )}
                >
                  <Users size={15} className="text-gray-500" />
                  <span>Referral Program</span>
                </NavLink>

                <NavLink
                  to="/employee/profile"
                  onClick={() => setOpen(false)}
                  className={({ isActive }) => clsx(
                    'flex items-center gap-2.5 px-2.5 py-1.5 rounded-xl text-[13px] font-medium transition-colors',
                    isActive
                      ? 'bg-blue-50/80 text-blue-700 font-semibold'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  )}
                >
                  <Settings size={15} className="text-gray-500" />
                  <span>Settings</span>
                </NavLink>
              </div>
            </div>
          </div>

          {/* Bottom Card & Sign Out */}
          <div className="p-3 border-t border-gray-100 space-y-2.5">
            {/* Premium Upgrade Card */}
            <div className="bg-[#f8faff] rounded-2xl border border-blue-100/80 p-3.5">
              <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-white mb-2 shadow-sm shadow-blue-500/20">
                <Sparkles size={13} />
              </div>
              <div className="font-bold text-[12px] text-gray-900 mb-0.5">
                Premium Account!
              </div>
              <div className="text-[11px] text-gray-500 leading-tight mb-3">
                Upgrade to a premium account that allows more all features
              </div>
              <button
                onClick={() => navigate('/employee/matching')}
                className="w-full py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-[12px] font-semibold transition-colors shadow-sm shadow-blue-600/20"
              >
                Upgrade
              </button>
            </div>

            {/* Red Outline Sign Out Button */}
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
                  Hi, Good Morning {firstName}
                </h1>
                <p className="text-[12px] sm:text-[13px] text-gray-400">
                  Hope your morning is off to a great start!
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
              <div
                onClick={() => navigate('/employee/profile')}
                className="flex items-center gap-2 pl-1 pr-2.5 py-1 rounded-full border border-gray-200 hover:border-gray-300 cursor-pointer transition-colors"
              >
                <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-amber-400 to-orange-500 flex items-center justify-center text-white text-[11px] font-bold shadow-sm">
                  {firstName[0]}
                </div>
                <span className="text-[12px] font-semibold text-gray-800 hidden sm:inline">
                  {user?.name || 'Alexa Dhawan'}
                </span>
                <ChevronDown size={12} className="text-gray-400" />
              </div>
            </div>
          </header>

          {/* Main Page Content */}
          <main className="flex-1 overflow-y-auto px-6 sm:px-8 py-6">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  )
}
