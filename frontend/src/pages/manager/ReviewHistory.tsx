import { History, Clock, CheckCircle, XCircle, RefreshCw, Sparkles } from 'lucide-react'

const DEMO_HISTORY = [
  { id: 'h1', employee: 'Anika Sharma', type: 'Career Orchestrator', decision: 'approve',         comment: 'Reviewed the recommendations and verified GitHub code evidence. Good progress.', timestamp: '2026-10-30T09:15:00Z', reviewer: 'Marcus Vance' },
  { id: 'h2', employee: 'Raj Patel',    type: 'Career Orchestrator', decision: 'request_changes', comment: 'Two tasks need further evidence before final milestone confirmation.',         timestamp: '2026-10-29T14:32:00Z', reviewer: 'Marcus Vance' },
  { id: 'h3', employee: 'Mei Lin',      type: 'Career Orchestrator', decision: 'reject',          comment: 'Skill evidence insufficient for claimed Senior level. Recommended intermediate pathway.', timestamp: '2026-10-28T11:00:00Z', reviewer: 'Marcus Vance' },
]

const decisionConfig: Record<string, { icon: React.ReactNode; badge: string; label: string }> = {
  approve:         { icon: <CheckCircle size={13} className="text-emerald-600" />, badge: 'bg-emerald-50 text-emerald-700 border-emerald-200', label: 'Approved' },
  reject:          { icon: <XCircle size={13} className="text-red-500" />,         badge: 'bg-red-50 text-red-700 border-red-200',         label: 'Rejected' },
  request_changes: { icon: <RefreshCw size={13} className="text-amber-500" />,       badge: 'bg-amber-50 text-amber-700 border-amber-200',       label: 'Changes Requested' },
}

export default function ReviewHistory() {
  return (
    <div className="space-y-6 font-[-apple-system,BlinkMacSystemFont,'SF_Pro_Display','Inter',sans-serif] animate-[fadeIn_0.4s_ease-out]">
      <div>
        <h2 className="text-xl font-bold text-gray-900 tracking-tight">Review History & Audit Trail</h2>
        <p className="text-xs text-gray-400 mt-0.5">Immutable record of all manager decisions and verified evidence evaluations.</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.02)] overflow-hidden">
        <div className="px-5 py-3.5 border-b border-gray-100 flex items-center justify-between bg-[#fbfcfd]">
          <div className="flex items-center gap-2">
            <History size={15} className="text-blue-600" />
            <span className="font-bold text-xs text-gray-900">Historical Decisions</span>
          </div>
          <span className="text-[11px] font-semibold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-md">
            {DEMO_HISTORY.length} Logs
          </span>
        </div>

        <div className="divide-y divide-gray-100">
          {DEMO_HISTORY.map((h) => {
            const cfg = decisionConfig[h.decision] ?? decisionConfig['approve']
            return (
              <div key={h.id} className="p-4 sm:p-5 hover:bg-gray-50/60 transition-colors">
                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                    {cfg.icon}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="font-bold text-xs text-gray-900">{h.employee}</span>
                      <span className="text-[10px] font-semibold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-md">
                        {h.type}
                      </span>
                      <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border ${cfg.badge}`}>
                        {cfg.icon} {cfg.label}
                      </span>
                    </div>

                    <p className="text-xs text-gray-600 leading-relaxed mb-2">{h.comment}</p>

                    <div className="text-[11px] text-gray-400 flex items-center gap-2">
                      <Clock size={11} />
                      <span>{new Date(h.timestamp).toLocaleString()}</span>
                      <span>· Reviewer: {h.reviewer}</span>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
