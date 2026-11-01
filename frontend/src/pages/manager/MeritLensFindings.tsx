import { Eye, CheckCircle, XCircle, AlertCircle, Info, MessageSquare, CheckCircle2 } from 'lucide-react'
import { useState } from 'react'

interface Finding {
  id: string
  employee: string
  claim: string
  evidence: string
  finding: string
  status: 'Supported' | 'Contradicted' | 'Insufficient Evidence' | 'Context Needed' | 'Overlooked Contribution'
  managerComment?: string
  resolved: boolean
}

const DEMO_FINDINGS: Finding[] = [
  {
    id: 'f1', employee: 'Anika Sharma',
    claim: 'Employee demonstrated React development skills.',
    evidence: 'Task Management Web App — React implementation with hooks and state management.',
    finding: 'Supported by project evidence.',
    status: 'Supported', resolved: false,
  },
  {
    id: 'f2', employee: 'Anika Sharma',
    claim: 'Employee did not contribute to backend development.',
    evidence: 'Backend API implementation recorded in project activity (Node.js + Express).',
    finding: 'Potential contradiction — manager clarification required.',
    status: 'Contradicted', resolved: false,
  },
  {
    id: 'f3', employee: 'Raj Patel',
    claim: 'Employee completed all assigned data analysis tasks.',
    evidence: 'Two of five assigned tasks show no completion record.',
    finding: 'Insufficient evidence to fully support the claim.',
    status: 'Insufficient Evidence', resolved: false,
  },
]

const statusConfig: Record<string, { icon: React.ReactNode; badge: string }> = {
  Supported:                { icon: <CheckCircle size={13} className="text-emerald-600" />, badge: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  Contradicted:             { icon: <XCircle size={13} className="text-red-500" />,         badge: 'bg-red-50 text-red-700 border-red-200' },
  'Insufficient Evidence':  { icon: <AlertCircle size={13} className="text-amber-500" />,    badge: 'bg-amber-50 text-amber-700 border-amber-200' },
  'Context Needed':         { icon: <Info size={13} className="text-blue-500" />,            badge: 'bg-blue-50 text-blue-700 border-blue-200' },
  'Overlooked Contribution':{ icon: <AlertCircle size={13} className="text-indigo-500" />,  badge: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
}

export default function MeritLensFindings() {
  const [findings, setFindings] = useState<Finding[]>(DEMO_FINDINGS)
  const [comments, setComments] = useState<Record<string, string>>({})
  const [resolving, setResolving] = useState<string | null>(null)

  const resolve = (id: string) => {
    setFindings(f => f.map(x => x.id === id ? { ...x, resolved: true, managerComment: comments[id] ?? 'Manager clarification accepted and verified.' } : x))
    setResolving(null)
  }

  return (
    <div className="space-y-6 font-[-apple-system,BlinkMacSystemFont,'SF_Pro_Display','Inter',sans-serif] animate-[fadeIn_0.4s_ease-out]">
      <div>
        <h2 className="text-xl font-bold text-gray-900 tracking-tight">Career Orchestrator Findings & Resolution</h2>
        <p className="text-xs text-gray-400 mt-0.5">Examine flagged performance claims and attach verified context before finalizing ratings.</p>
      </div>

      <div className="space-y-4">
        {findings.map((f) => {
          const cfg = statusConfig[f.status] ?? statusConfig['Context Needed']
          return (
            <div
              key={f.id}
              className={`bg-white rounded-2xl border border-gray-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.02)] overflow-hidden transition-all ${
                f.resolved ? 'opacity-70 bg-gray-50/50' : ''
              }`}
            >
              <div className="px-5 py-3 border-b border-gray-100 flex items-center justify-between bg-[#fbfcfd]">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-blue-600 text-white text-[11px] font-bold flex items-center justify-center">
                    {f.employee[0]}
                  </div>
                  <span className="text-xs font-bold text-gray-900">{f.employee}</span>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border text-[11px] font-bold uppercase tracking-wider ${cfg.badge}`}>
                    {cfg.icon} {f.status}
                  </span>
                  {f.resolved && (
                    <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      Resolved
                    </span>
                  )}
                </div>
              </div>

              <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-100 text-xs">
                <div className="p-4 sm:p-5">
                  <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Manager Claim</div>
                  <p className="text-gray-800 leading-relaxed font-medium">{f.claim}</p>
                </div>
                <div className="p-4 sm:p-5 bg-[#fbfcfd]">
                  <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Employee Artifact Evidence</div>
                  <p className="text-gray-700 leading-relaxed">{f.evidence}</p>
                </div>
              </div>

              <div className="px-5 py-2.5 border-t border-gray-100 bg-gray-50/50 text-xs text-gray-600 font-medium">
                Analysis: {f.finding}
              </div>

              {!f.resolved && (
                <div className="p-4 border-t border-gray-100 bg-white">
                  {resolving === f.id ? (
                    <div className="space-y-3">
                      <textarea
                        value={comments[f.id] ?? ''}
                        onChange={e => setComments(c => ({ ...c, [f.id]: e.target.value }))}
                        rows={2}
                        placeholder="Add manager clarification or update the finding evaluation…"
                        className="w-full p-3 bg-[#fbfcfd] border border-gray-200 rounded-xl text-xs outline-none focus:border-blue-500 resize-none"
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => resolve(f.id)}
                          className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-colors"
                        >
                          Resolve & Confirm
                        </button>
                        <button
                          onClick={() => setResolving(null)}
                          className="px-4 py-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 text-xs font-semibold transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => setResolving(f.id)}
                      className="px-3.5 py-1.5 rounded-xl border border-gray-200 hover:border-blue-500 hover:text-blue-600 text-xs font-semibold text-gray-700 transition-colors flex items-center gap-1.5"
                    >
                      <MessageSquare size={13} /> Add Context & Resolve
                    </button>
                  )}
                </div>
              )}

              {f.resolved && f.managerComment && (
                <div className="p-3 border-t border-gray-100 bg-emerald-50/40 text-xs text-emerald-900 font-medium">
                  Resolution Note: {f.managerComment}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
