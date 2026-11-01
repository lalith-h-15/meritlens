import { useOrchestrator, LearningRec } from '../../context/OrchestratorContext'
import { Link } from 'react-router-dom'
import { BookOpen, ArrowRight, CheckCircle2, Award, Clock } from 'lucide-react'

const priorityConfig: Record<string, { color: string; badge: string }> = {
  High:   { color: 'text-red-700',    badge: 'bg-red-50 text-red-700 border-red-200' },
  Medium: { color: 'text-amber-700', badge: 'bg-amber-50 text-amber-700 border-amber-200' },
  Low:    { color: 'text-emerald-700',  badge: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
}

export default function LearningPathways() {
  const { runResult } = useOrchestrator()
  const recs: LearningRec[] = runResult?.agents?.learningPathway?.recommendations ?? []

  return (
    <div className="space-y-6 font-[-apple-system,BlinkMacSystemFont,'SF_Pro_Display','Inter',sans-serif] animate-[fadeIn_0.4s_ease-out]">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 tracking-tight">Enrolled Course · Learning Pathways</h2>
        <p className="text-xs text-gray-400 mt-0.5">Custom action roadmap designed to close your skill gaps for your chosen target role.</p>
      </div>

      {recs.length > 0 && (
        <>
          {/* Priority Summary */}
          <div className="grid grid-cols-3 gap-3.5">
            {(['High', 'Medium', 'Low'] as const).map(p => {
              const count = recs.filter(r => r.priority === p).length
              const cfg = priorityConfig[p]
              return (
                <div key={p} className="bg-white rounded-2xl border border-gray-200/80 p-4 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
                  <div className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1">{p} Priority</div>
                  <div className={`text-2xl font-extrabold ${cfg.color}`}>{count}</div>
                  <div className="text-[11px] text-gray-400 mt-0.5">Actionable modules</div>
                </div>
              )
            })}
          </div>

          {/* Timeline Pathway Cards */}
          <div className="space-y-3">
            {recs.map((rec, i) => {
              const cfg = priorityConfig[rec.priority] ?? priorityConfig['Low']
              return (
                <div
                  key={i}
                  className="bg-white rounded-2xl border border-gray-200/80 p-5 shadow-[0_1px_3px_rgba(0,0,0,0.02)] hover:border-gray-300 transition-all"
                >
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`px-2 py-0.5 rounded-full border text-[10px] font-bold uppercase tracking-wider ${cfg.badge}`}>
                        {rec.priority} Priority
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-100 text-[10px] font-semibold">
                        {rec.skill}
                      </span>
                    </div>
                    <span className="text-xs font-semibold text-gray-400">Step {i + 1}</span>
                  </div>

                  <h3 className="font-bold text-sm text-gray-900 mb-1.5">{rec.activity}</h3>
                  <p className="text-xs text-gray-600 leading-relaxed bg-[#fbfcfd] p-3 rounded-xl border border-gray-100">
                    <span className="font-semibold text-gray-700">Expected Outcome:</span> {rec.outcome}
                  </p>
                </div>
              )
            })}
          </div>

          {/* Action button */}
          <div className="flex justify-end">
            <Link
              to="/employee/matching"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm transition-all"
            >
              View Role Matching <ArrowRight size={13} />
            </Link>
          </div>
        </>
      )}
    </div>
  )
}
