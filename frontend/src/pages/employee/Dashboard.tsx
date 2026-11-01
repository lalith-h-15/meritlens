import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useOrchestrator, Role } from '../../context/OrchestratorContext'
import {
  Sparkles, ArrowUpDown, SlidersHorizontal, LayoutGrid, Check,
  ChevronLeft, ChevronRight, Briefcase, Zap, CheckCircle2, ArrowRight
} from 'lucide-react'

interface JobMatch {
  id: string
  name: string
  company: string
  workType: string
  salary: string
  match: number
  time: string
  verified: boolean
}

const DEMO_MATCHES: JobMatch[] = [
  {
    id: 'm1',
    name: 'Full-Stack Software Engineer',
    company: 'SAP Cloud Platform',
    workType: 'Full-time · Remote',
    salary: '$135,000 - $160,000',
    match: 96,
    time: '2h ago',
    verified: true,
  },
  {
    id: 'm2',
    name: 'Frontend Architect (React & TS)',
    company: 'Deloitte Digital',
    workType: 'Full-time · Hybrid',
    salary: '$140,000 - $170,000',
    match: 94,
    time: '4h ago',
    verified: true,
  },
  {
    id: 'm3',
    name: 'Enterprise Cloud Application Dev',
    company: 'IBM Systems Lab',
    workType: 'Contract · Remote',
    salary: '$75 - $95 / hr',
    match: 89,
    time: '1d ago',
    verified: true,
  },
  {
    id: 'm4',
    name: 'Junior Data & Systems Analyst',
    company: 'Accenture Technology',
    workType: 'Full-time · On-site',
    salary: '$95,000 - $115,000',
    match: 86,
    time: '2d ago',
    verified: false,
  },
  {
    id: 'm5',
    name: 'AI Integration & Solutions Engineer',
    company: 'Helvion Enterprise AI',
    workType: 'Full-time · Remote',
    salary: '$150,000 - $185,000',
    match: 82,
    time: '3d ago',
    verified: true,
  },
  {
    id: 'm6',
    name: 'DevOps & Microservices Lead',
    company: 'Wipro Digital Services',
    workType: 'Full-time · Hybrid',
    salary: '$130,000 - $155,000',
    match: 78,
    time: '5d ago',
    verified: false,
  },
]

export default function EmployeeDashboard() {
  const { user } = useAuth()
  const { roles, selectedRole, selectRole, runOrchestrator, loading } = useOrchestrator()
  const navigate = useNavigate()

  const [searchVal, setSearchVal] = useState('')
  const [selectedMatches, setSelectedMatches] = useState<string[]>(['m1', 'm2'])
  const [page, setPage] = useState(1)

  const toggleSelect = (id: string) => {
    setSelectedMatches(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    )
  }

  const toggleAll = () => {
    if (selectedMatches.length === DEMO_MATCHES.length) {
      setSelectedMatches([])
    } else {
      setSelectedMatches(DEMO_MATCHES.map(m => m.id))
    }
  }

  const handleStartAnalysis = async () => {
    if (roles.length > 0 && !selectedRole) {
      selectRole(roles[0])
    }
    await runOrchestrator()
    navigate('/employee/roles')
  }

  return (
    <div className="space-y-6 font-[-apple-system,BlinkMacSystemFont,'SF_Pro_Display','Inter',sans-serif] animate-[fadeIn_0.4s_ease-out]">
      {/* ── Search & Action Bar Row ───────────────────────────────── */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Search input with keyboard badge */}
        <div className="relative w-full sm:w-[360px]">
          <div className="flex items-center px-3.5 py-2.5 bg-white border border-gray-200/80 rounded-xl shadow-[0_1px_2px_rgba(0,0,0,0.02)] focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
            <Sparkles size={14} className="text-gray-400 mr-2.5 shrink-0" />
            <input
              type="text"
              value={searchVal}
              onChange={e => setSearchVal(e.target.value)}
              placeholder="Optimizing out queue..."
              className="w-full text-xs text-gray-800 placeholder-gray-400 bg-transparent outline-none"
            />
            <span className="ml-2 px-1.5 py-0.5 rounded border border-gray-200 text-[10px] font-mono text-gray-400 bg-gray-50 shrink-0">
              F
            </span>
          </div>
        </div>

        {/* Start Auto-Applied primary pill button */}
        <button
          onClick={handleStartAnalysis}
          disabled={loading}
          className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gray-900 hover:bg-black text-white text-xs font-semibold shadow-sm hover:shadow transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-1.5 shrink-0"
        >
          {loading && <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
          {loading ? 'Analyzing Profile…' : 'Start Auto-Applied'}
        </button>
      </div>

      {/* ── Royal Blue Hero Gradient Banner ───────────────────────── */}
      <div className="relative bg-gradient-to-r from-blue-700 via-blue-600 to-blue-800 rounded-2xl p-6 sm:p-7 text-white overflow-hidden shadow-sm shadow-blue-700/10">
        {/* Subtle decorative watermark icon */}
        <div className="absolute right-4 -bottom-6 opacity-10 pointer-events-none">
          <Zap size={140} className="text-white" />
        </div>

        <div className="relative z-10 max-w-xl">
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight mb-1 text-white">
            Analyzing your profile...
          </h2>
          <p className="text-xs sm:text-sm text-blue-100 font-normal leading-relaxed">
            Matching you with relevant opportunities, verified review evidence, and personalized learning pathways.
          </p>
        </div>
      </div>

      {/* ── Content Section: Highest Matches ──────────────────────── */}
      <div className="space-y-3.5">
        {/* Header & Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h3 className="text-base sm:text-lg font-bold text-gray-900 tracking-tight">
            Highest Matches
          </h3>

          <div className="flex items-center gap-2 flex-wrap">
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-gray-200 bg-white text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors">
              <ArrowUpDown size={12} className="text-gray-400" />
              <span>Sort by Score</span>
            </button>
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-gray-200 bg-white text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors">
              <LayoutGrid size={12} className="text-gray-400" />
              <span>View List</span>
            </button>
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-gray-200 bg-white text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors">
              <SlidersHorizontal size={12} className="text-gray-400" />
              <span>Filter</span>
            </button>
          </div>
        </div>

        {/* Matches Table */}
        <div className="bg-white rounded-2xl border border-gray-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.02)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 bg-[#fbfcfd] text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                  <th className="py-3 pl-4 pr-2 w-10">
                    <input
                      type="checkbox"
                      checked={selectedMatches.length === DEMO_MATCHES.length}
                      onChange={toggleAll}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                    />
                  </th>
                  <th className="py-3 px-3">
                    <div className="flex items-center gap-1 cursor-pointer hover:text-gray-600">
                      <span>Job Name</span>
                      <ArrowUpDown size={11} />
                    </div>
                  </th>
                  <th className="py-3 px-3">
                    <div className="flex items-center gap-1 cursor-pointer hover:text-gray-600">
                      <span>Company</span>
                      <ArrowUpDown size={11} />
                    </div>
                  </th>
                  <th className="py-3 px-3">
                    <div className="flex items-center gap-1 cursor-pointer hover:text-gray-600">
                      <span>Work Type</span>
                      <ArrowUpDown size={11} />
                    </div>
                  </th>
                  <th className="py-3 px-3">
                    <div className="flex items-center gap-1 cursor-pointer hover:text-gray-600">
                      <span>Salary</span>
                      <ArrowUpDown size={11} />
                    </div>
                  </th>
                  <th className="py-3 px-3">
                    <div className="flex items-center gap-1 cursor-pointer hover:text-gray-600">
                      <span>Match</span>
                      <ArrowUpDown size={11} />
                    </div>
                  </th>
                  <th className="py-3 px-3">
                    <div className="flex items-center gap-1 cursor-pointer hover:text-gray-600">
                      <span>Time</span>
                      <ArrowUpDown size={11} />
                    </div>
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100 text-xs">
                {DEMO_MATCHES.map(item => {
                  const isChecked = selectedMatches.includes(item.id)
                  return (
                    <tr
                      key={item.id}
                      onClick={() => toggleSelect(item.id)}
                      className={`hover:bg-blue-50/40 cursor-pointer transition-colors ${isChecked ? 'bg-[#f8faff]' : ''}`}
                    >
                      <td className="py-3.5 pl-4 pr-2" onClick={e => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleSelect(item.id)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                        />
                      </td>

                      <td className="py-3.5 px-3">
                        <div className="font-semibold text-gray-900 flex items-center gap-2">
                          <span>{item.name}</span>
                          {item.verified && (
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-600" title="Audit Verified" />
                          )}
                        </div>
                      </td>

                      <td className="py-3.5 px-3 text-gray-600 font-medium">
                        {item.company}
                      </td>

                      <td className="py-3.5 px-3">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-gray-100 text-gray-600 font-medium text-[11px]">
                          {item.workType}
                        </span>
                      </td>

                      <td className="py-3.5 px-3 text-gray-700 font-medium font-mono text-[11px]">
                        {item.salary}
                      </td>

                      <td className="py-3.5 px-3">
                        <div className="flex items-center gap-2">
                          <div className="w-16 bg-gray-100 rounded-full h-1.5 overflow-hidden">
                            <div
                              className="bg-blue-600 h-1.5 rounded-full"
                              style={{ width: `${item.match}%` }}
                            />
                          </div>
                          <span className="font-bold text-blue-600 text-[11px]">
                            {item.match}%
                          </span>
                        </div>
                      </td>

                      <td className="py-3.5 px-3 text-gray-400 text-[11px]">
                        {item.time}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* Table Footer / Pagination */}
          <div className="px-5 py-3.5 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
            <span className="font-medium text-gray-400">
              Page {page} of 10
            </span>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1 rounded-xl border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:hover:bg-transparent font-medium text-gray-700 transition-colors"
              >
                Previews
              </button>
              <button
                onClick={() => setPage(p => p + 1)}
                className="px-3 py-1 rounded-xl border border-gray-200 hover:bg-gray-50 font-medium text-gray-700 transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
