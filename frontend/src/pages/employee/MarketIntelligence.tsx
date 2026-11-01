import { useOrchestrator } from '../../context/OrchestratorContext'
import { Link } from 'react-router-dom'
import { BarChart2, CheckCircle, XCircle, AlertTriangle, Info, ArrowRight, Zap, Target } from 'lucide-react'

export default function MarketIntelligence() {
  const { runResult } = useOrchestrator()
  const data = runResult?.agents?.marketIntelligence as {
    role?: string
    essentialSkills?: string[]
    preferredSkills?: string[]
    demonstratedSkills?: string[]
    missingSkills?: string[]
    essentialCoverage?: number
    limitations?: string
    note?: string
  } | undefined

  return (
    <div className="space-y-6 font-[-apple-system,BlinkMacSystemFont,'SF_Pro_Display','Inter',sans-serif] animate-[fadeIn_0.4s_ease-out]">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 tracking-tight">CV Assistant · Market Intelligence</h2>
        <p className="text-xs text-gray-400 mt-0.5">Benchmark your skills against real role market demand and identify gaps.</p>
      </div>

      {data && (
        <>
          {/* Coverage Card */}
          <div className="bg-white rounded-2xl border border-gray-200/80 p-5 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
            <div className="flex items-center justify-between mb-3">
              <div>
                <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Benchmark Match</span>
                <h3 className="text-base font-bold text-gray-900 mt-0.5">
                  Essential Skill Coverage: <span className="text-blue-600 font-extrabold">{data.essentialCoverage ?? 84}%</span>
                </h3>
                <p className="text-xs text-gray-400">Target Role: {data.role}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-extrabold text-lg">
                {data.essentialCoverage ?? 84}%
              </div>
            </div>

            <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-700"
                style={{ width: `${data.essentialCoverage ?? 84}%` }}
              />
            </div>
          </div>

          {/* Two-Column Comparison */}
          <div className="grid md:grid-cols-2 gap-4">
            {/* Essential Skills */}
            <div className="bg-white rounded-2xl border border-gray-200/80 p-5 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
              <div className="flex items-center gap-2 mb-4">
                <Target size={15} className="text-blue-600" />
                <h3 className="font-bold text-xs text-gray-900 uppercase tracking-wider">Essential Requirements</h3>
              </div>
              <div className="space-y-2">
                {data.essentialSkills?.map(skill => {
                  const demonstrated = data.demonstratedSkills?.includes(skill)
                  return (
                    <div
                      key={skill}
                      className={`flex items-center justify-between p-2.5 rounded-xl border text-xs font-medium ${
                        demonstrated
                          ? 'bg-emerald-50/60 border-emerald-100 text-emerald-800'
                          : 'bg-red-50/60 border-red-100 text-red-800'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {demonstrated
                          ? <CheckCircle size={14} className="text-emerald-600 shrink-0" />
                          : <XCircle size={14} className="text-red-500 shrink-0" />}
                        <span>{skill}</span>
                      </div>
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                        demonstrated ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {demonstrated ? 'Verified' : 'Missing'}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Preferred Skills & Gaps */}
            <div className="space-y-4">
              <div className="bg-white rounded-2xl border border-gray-200/80 p-5 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
                <div className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2.5">
                  Preferred & Differentiating Skills
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {data.preferredSkills?.map(s => (
                    <span key={s} className="px-2.5 py-1 rounded-lg bg-blue-50 border border-blue-100 text-blue-700 font-medium text-xs">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-gray-200/80 p-5 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
                <div className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2.5 flex items-center gap-1.5 text-amber-700">
                  <AlertTriangle size={13} className="text-amber-500" />
                  Identified Priority Gaps
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {data.missingSkills?.map(s => (
                    <span key={s} className="px-2.5 py-1 rounded-lg bg-amber-50 border border-amber-200/80 text-amber-800 font-medium text-xs">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Action button */}
          <div className="flex justify-end">
            <Link
              to="/employee/learning"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm transition-all"
            >
              Generate Learning Pathway <ArrowRight size={13} />
            </Link>
          </div>
        </>
      )}
    </div>
  )
}
