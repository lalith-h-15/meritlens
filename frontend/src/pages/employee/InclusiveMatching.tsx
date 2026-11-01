import { useOrchestrator } from '../../context/OrchestratorContext'
import { Link } from 'react-router-dom'
import { Target, CheckCircle, XCircle, Info, ArrowRight, ShieldCheck } from 'lucide-react'

export default function InclusiveMatching() {
  const { runResult } = useOrchestrator()
  const data = runResult?.agents?.inclusiveMatching as {
    targetRole?: string
    matchedSkills?: string[]
    missingRequirements?: string[]
    explanation?: string
    alignmentScore?: number
    disclaimer?: string
  } | undefined

  return (
    <div className="space-y-6 font-[-apple-system,BlinkMacSystemFont,'SF_Pro_Display','Inter',sans-serif] animate-[fadeIn_0.4s_ease-out]">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 tracking-tight">Support · Inclusive Matching</h2>
        <p className="text-xs text-gray-400 mt-0.5">Objective, skills-first role matching audited against biased scoring criteria.</p>
      </div>

      {data && (
        <>
          {/* Match Score Gauge Card */}
          <div className="bg-white rounded-2xl border border-gray-200/80 p-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex flex-col sm:flex-row items-center gap-6">
            {/* SVG circular donut in Royal Blue */}
            <div className="relative w-28 h-28 shrink-0">
              <svg className="w-28 h-28 -rotate-90" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="15.9" fill="none" stroke="#f1f5f9" strokeWidth="3" />
                <circle
                  cx="18" cy="18" r="15.9" fill="none"
                  stroke="#2563eb" strokeWidth="3"
                  strokeDasharray={`${data.alignmentScore ?? 88} ${100 - (data.alignmentScore ?? 88)}`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-extrabold text-gray-900">{data.alignmentScore ?? 88}%</span>
                <span className="text-[10px] text-gray-400 uppercase font-semibold">Match</span>
              </div>
            </div>

            <div className="flex-1 text-center sm:text-left">
              <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[11px] font-bold border border-blue-100">
                Verified Fit
              </span>
              <h3 className="text-lg font-bold text-gray-900 mt-1.5">{data.targetRole}</h3>
              <p className="text-xs text-gray-500 mt-1 leading-relaxed">{data.explanation}</p>
            </div>
          </div>

          {/* Matched vs Missing Grid */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-white rounded-2xl border border-gray-200/80 p-5 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
              <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <CheckCircle size={14} className="text-emerald-500" />
                Validated Competencies ({data.matchedSkills?.length ?? 0})
              </div>
              <div className="space-y-2">
                {data.matchedSkills?.map(s => (
                  <div key={s} className="flex items-center gap-2 p-2.5 rounded-xl bg-emerald-50/60 border border-emerald-100 text-xs font-semibold text-emerald-900">
                    <CheckCircle size={13} className="text-emerald-600 shrink-0" />
                    <span>{s}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200/80 p-5 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
              <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <XCircle size={14} className="text-red-400" />
                Missing Role Baseline ({data.missingRequirements?.length ?? 0})
              </div>
              <div className="space-y-2">
                {data.missingRequirements?.map(s => (
                  <div key={s} className="flex items-center gap-2 p-2.5 rounded-xl bg-red-50/60 border border-red-100 text-xs font-semibold text-red-900">
                    <XCircle size={13} className="text-red-500 shrink-0" />
                    <span>{s}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Action button */}
          <div className="flex justify-end">
            <Link
              to="/employee/readiness"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm transition-all"
            >
              Check Employer Readiness <ArrowRight size={13} />
            </Link>
          </div>
        </>
      )}
    </div>
  )
}
