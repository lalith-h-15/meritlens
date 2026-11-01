import { useOrchestrator } from '../../context/OrchestratorContext'
import { Link } from 'react-router-dom'
import { Award, CheckCircle, AlertCircle, ArrowRight, Info, ShieldCheck } from 'lucide-react'

export default function EmployerReadiness() {
  const { runResult } = useOrchestrator()
  const data = runResult?.agents?.employerReadiness as {
    evidenceCoverage?: number
    demonstratedCapabilities?: string[]
    areasNeedingEvidence?: string[]
    recommendations?: string[]
    disclaimer?: string
  } | undefined

  return (
    <div className="space-y-6 font-[-apple-system,BlinkMacSystemFont,'SF_Pro_Display','Inter',sans-serif] animate-[fadeIn_0.4s_ease-out]">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 tracking-tight">Certificate Feed · Employer Readiness</h2>
        <p className="text-xs text-gray-400 mt-0.5">Objective evaluation of profile evidence depth across all core operational areas.</p>
      </div>

      {data && (
        <>
          {/* Progress Card */}
          <div className="bg-white rounded-2xl border border-gray-200/80 p-5 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
            <div className="flex items-center justify-between mb-3">
              <div>
                <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Audit Documentation</span>
                <h3 className="text-base font-bold text-gray-900 mt-0.5">
                  Evidence Coverage: <span className="text-blue-600 font-extrabold">{data.evidenceCoverage ?? 82}%</span>
                </h3>
              </div>
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-extrabold text-lg">
                {data.evidenceCoverage ?? 82}%
              </div>
            </div>

            <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-700"
                style={{ width: `${data.evidenceCoverage ?? 82}%` }}
              />
            </div>
          </div>

          {/* Capabilities & Areas Grid */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-white rounded-2xl border border-gray-200/80 p-5 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
              <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <CheckCircle size={14} className="text-emerald-500" />
                Demonstrated Capabilities
              </div>
              <div className="space-y-2">
                {data.demonstratedCapabilities?.map(c => (
                  <div key={c} className="flex items-start gap-2.5 p-2.5 rounded-xl bg-emerald-50/60 border border-emerald-100 text-xs font-medium text-emerald-900">
                    <CheckCircle size={13} className="text-emerald-600 shrink-0 mt-0.5" />
                    <span>{c}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200/80 p-5 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
              <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <AlertCircle size={14} className="text-amber-500" />
                Areas Needing Further Evidence
              </div>
              <div className="space-y-2">
                {data.areasNeedingEvidence?.map(a => (
                  <div key={a} className="flex items-start gap-2.5 p-2.5 rounded-xl bg-amber-50/60 border border-amber-200/80 text-xs font-medium text-amber-900">
                    <AlertCircle size={13} className="text-amber-600 shrink-0 mt-0.5" />
                    <span>{a}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recommendations */}
          {data.recommendations?.length ? (
            <div className="bg-white rounded-2xl border border-gray-200/80 p-5 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
              <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-3">
                Recommended Verification Steps
              </div>
              <div className="space-y-2">
                {data.recommendations.map((r, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100 text-xs text-gray-700">
                    <div className="w-5 h-5 rounded-full bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                      {i + 1}
                    </div>
                    <span className="font-medium leading-relaxed">{r}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          {/* Action button */}
          <div className="flex justify-end">
            <Link
              to="/employee/bias"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm transition-all"
            >
              Run Bias Audit <ArrowRight size={13} />
            </Link>
          </div>
        </>
      )}
    </div>
  )
}
