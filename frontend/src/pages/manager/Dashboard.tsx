import { useAuth } from '../../context/AuthContext'
import { Users, GitBranch, Eye, History, Clock, CheckCircle, AlertCircle, ArrowRight, Zap, ShieldCheck } from 'lucide-react'
import { Link } from 'react-router-dom'

const stats = [
  { label: 'Awaiting Review',    value: '3',  icon: Clock,       color: 'text-amber-600',   bg: 'bg-amber-50',   to: '/manager/orchestrator' },
  { label: 'Pending Findings',   value: '2',  icon: AlertCircle, color: 'text-blue-600',    bg: 'bg-blue-50',    to: '/manager/findings' },
  { label: 'Resolved Today',     value: '5',  icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-50', to: '/manager/history' },
  { label: 'Total Employees',    value: '12', icon: Users,       color: 'text-indigo-600',  bg: 'bg-indigo-50',  to: '/manager/employees' },
]

const quickNav = [
  { to: '/manager/employees',    icon: Users,      title: 'Employee Reviews',                desc: 'View all employees awaiting Career Orchestrator review.' },
  { to: '/manager/orchestrator', icon: GitBranch,  title: 'Orchestrator Reviews',            desc: 'Approve, reject, or request changes on analysis runs.' },
  { to: '/manager/findings',     icon: Eye,        title: 'Career Orchestrator Findings',    desc: 'Review performance verification findings and add context.' },
  { to: '/manager/history',      icon: History,    title: 'Review History',                  desc: 'Full audit trail of all reviews and decisions.' },
]

export default function ManagerDashboard() {
  const { user } = useAuth()

  return (
    <div className="space-y-6 font-[-apple-system,BlinkMacSystemFont,'SF_Pro_Display','Inter',sans-serif] animate-[fadeIn_0.4s_ease-out]">
      {/* Royal Blue Hero Banner */}
      <div className="relative bg-gradient-to-r from-blue-700 via-blue-600 to-blue-800 rounded-2xl p-6 sm:p-7 text-white overflow-hidden shadow-sm shadow-blue-700/10">
        <div className="relative z-10 max-w-xl">
          <span className="text-[10px] font-bold uppercase tracking-wider text-blue-200">
            Manager Control Center
          </span>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white mt-1 mb-1">
            Welcome back, {user?.name?.split(' ')[0] || 'Manager'}
          </h2>
          <p className="text-xs sm:text-sm text-blue-100 font-normal leading-relaxed">
            Monitor and resolve performance reviews, examine AI evidence validations, and approve employee milestones.
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
        {stats.map(({ label, value, icon: Icon, color, bg, to }) => (
          <Link
            key={label}
            to={to}
            className="bg-white rounded-2xl border border-gray-200/80 p-4 shadow-[0_1px_2px_rgba(0,0,0,0.02)] hover:border-gray-300 transition-all"
          >
            <div className={`w-8 h-8 rounded-xl ${bg} flex items-center justify-center mb-2.5`}>
              <Icon size={16} className={color} />
            </div>
            <div className="text-2xl font-extrabold text-gray-900">{value}</div>
            <div className="text-[11px] text-gray-400 mt-0.5">{label}</div>
          </Link>
        ))}
      </div>

      {/* Quick Nav Grid */}
      <div className="grid md:grid-cols-2 gap-4">
        {quickNav.map(({ to, icon: Icon, title, desc }) => (
          <Link
            key={to}
            to={to}
            className="bg-white rounded-2xl border border-gray-200/80 p-5 shadow-[0_1px_3px_rgba(0,0,0,0.02)] hover:border-blue-500 hover:shadow-md transition-all group flex items-start gap-4"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <Icon size={18} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-bold text-sm text-gray-900 mb-0.5 group-hover:text-blue-600 transition-colors">
                {title}
              </div>
              <div className="text-xs text-gray-500 leading-relaxed">{desc}</div>
            </div>
            <ArrowRight size={15} className="text-gray-300 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all mt-1 shrink-0" />
          </Link>
        ))}
      </div>
    </div>
  )
}
