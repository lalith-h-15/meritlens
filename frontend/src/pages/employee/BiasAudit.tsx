import { useOrchestrator } from '../../context/OrchestratorContext'
import { Link } from 'react-router-dom'
import { Shield, CheckCircle, AlertTriangle, Info, ShieldCheck, ArrowRight } from 'lucide-react'

export default function BiasAudit() {
  const { runResult } = useOrchestrator()
  const data = runResult?.agents?.biasAudit as {
    status?: string
    automatedFlags?: string[]
    criteriaReviewed?: string[]
    explanation?: string
    limitations?: string
  } | undefined

  const flagCount = data?.automatedFlags?.length ?? 0
  const clean = flagCount === 0

  return (
    <div className="space-y-6 font-[-apple-system,BlinkMacSystemFont,'SF_Pro_Display','Inter',sans-serif] animate-[fadeIn_0.4s_ease-out]">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 tracking-tight">Interview Simulation · Bias Audit</h2>
        <p className="text-xs text-gray-400 mt-0.5">Automated screening to ensure objective, bias-free assessment across performance reviews.</p>
      </div>

      {data && (
        <>
          {/* Status Banner */}
          <div className={`rounded-2xl border p-5 flex items-center gap-4 ${
            clean
              ? 'bg-emerald-50/70 border-emerald-200/80 text-emerald-900'
              : 'bg-amber-50/70 border-amber-200/80 text-amber-900'
          }`}>
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
              clean ? 'bg-emerald-600 text-white' : 'bg-amber-500 text-white'
            }`}>
              {clean ? <ShieldCheck size={22} /> : <AlertTriangle size={22} />}
            </div>

            <div>
              <h3 className="font-bold text-sm sm:text-base">
                {clean ? 'Audit Passed — Zero Disqualification Flags' : `${flagCount} Potential Flag(s) Detected`}
              </h3>
              <p className="text-xs opacity-80 mt-0.5">
                Current Audit Status: <span className="font-semibold">{data.status}</span>
              </p>
            </div>
          </div>

          {/* Criteria Reviewed Grid */}
          {data.criteriaReviewed?.length ? (
            <div className="bg-white rounded-2xl border border-gray-200/80 p-5 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
              <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-3">
                Criteria & Inclusivity Safeguards Audited
              </div>
              <div className="grid sm:grid-cols-2 gap-2.5">
                {data.criteriaReviewed.map((c, i) => (
                  <div key={i} className="flex items-center gap-2 p-3 rounded-xl bg-gray-50/80 border border-gray-100 text-xs font-medium text-gray-700">
                    <CheckCircle size={14} className="text-blue-600 shrink-0" />
                    <span>{c}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          {/* Explanation */}
          {data.explanation && (
            <div className="bg-white rounded-2xl border border-gray-200/80 p-5 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
              <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">Audit Report Synthesis</div>
              <p className="text-xs text-gray-600 leading-relaxed">{data.explanation}</p>
            </div>
          )}

          {/* Action button */}
          <div className="flex justify-end">
            <Link
              to="/employee/reviews"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm transition-all"
            >
              Verify Performance Claims <ArrowRight size={13} />
            </Link>
          </div>
        </>
      )}
    </div>
  )
}
