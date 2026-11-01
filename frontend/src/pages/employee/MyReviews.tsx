import { useEffect, useState } from 'react'
import { orchestratorAPI } from '../../lib/api'
import { useOrchestrator } from '../../context/OrchestratorContext'
import { FileText, Clock, CheckCircle, AlertCircle, XCircle, Info, MessageSquare, CheckCircle2 } from 'lucide-react'

interface ReviewRun {
  id: string
  roleId: string
  status: string
  createdAt: string
  managerReview?: {
    status: string
    decision?: string
    comment?: string
    reviewedAt?: string
    reviewerName?: string
  }
  agents?: {
    humanInTheLoop?: {
      claims?: { claim: string; evidence: string; finding: string; status: string }[]
    }
  }
}

const statusConfig: Record<string, { icon: React.ReactNode; color: string; badge: string }> = {
  supported: {
    icon: <CheckCircle size={13} className="text-emerald-600" />,
    color: 'text-emerald-700',
    badge: 'bg-emerald-50 text-emerald-700 border-emerald-200'
  },
  contradicted: {
    icon: <XCircle size={13} className="text-red-500" />,
    color: 'text-red-700',
    badge: 'bg-red-50 text-red-700 border-red-200'
  },
  'insufficient evidence': {
    icon: <AlertCircle size={13} className="text-amber-500" />,
    color: 'text-amber-700',
    badge: 'bg-amber-50 text-amber-700 border-amber-200'
  },
  'context needed': {
    icon: <Info size={13} className="text-blue-500" />,
    color: 'text-blue-700',
    badge: 'bg-blue-50 text-blue-700 border-blue-200'
  },
}

function getStatusCfg(status: string) {
  return statusConfig[status?.toLowerCase()] ?? {
    icon: <Info size={13} className="text-gray-500" />,
    color: 'text-gray-700',
    badge: 'bg-gray-50 text-gray-700 border-gray-200'
  }
}

export default function MyReviews() {
  const { runResult } = useOrchestrator()
  const [selected, setSelected] = useState<ReviewRun | null>((runResult as unknown as ReviewRun) || null)

  useEffect(() => {
    if (runResult) {
      setSelected(runResult as unknown as ReviewRun)
    }
  }, [runResult])

  const claims = selected?.agents?.humanInTheLoop?.claims ?? []

  return (
    <div className="space-y-6 font-[-apple-system,BlinkMacSystemFont,'SF_Pro_Display','Inter',sans-serif] animate-[fadeIn_0.4s_ease-out]">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 tracking-tight">Interview & Review · Career Orchestrator Verification</h2>
        <p className="text-xs text-gray-400 mt-0.5">Objective cross-examination of manager evaluation claims against verified project evidence.</p>
      </div>

      {selected && (
        <div className="space-y-4">
          {/* Summary Card */}
          <div className="bg-white rounded-2xl border border-gray-200/80 p-5 shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                <FileText size={18} />
              </div>
              <div>
                <h3 className="font-bold text-sm text-gray-900">
                  Performance Review Verification · {selected.roleId}
                </h3>
                <div className="text-[11px] text-gray-400 flex items-center gap-1 mt-0.5">
                  <Clock size={11} /> {new Date(selected.createdAt).toLocaleDateString()}
                  {selected.managerReview?.reviewerName && ` · Verified by ${selected.managerReview.reviewerName}`}
                </div>
              </div>
            </div>

            {selected.managerReview && (
              <span className={`px-3 py-1 rounded-full text-xs font-bold border capitalize self-start sm:self-auto ${
                selected.managerReview.decision === 'approve'
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : 'bg-amber-50 text-amber-700 border-amber-200'
              }`}>
                Manager Decision: {selected.managerReview.decision ?? selected.managerReview.status}
              </span>
            )}
          </div>

          {/* Claims vs Evidence Cards */}
          <div className="space-y-3.5">
            {claims.map((c, i) => {
              const cfg = getStatusCfg(c.status)
              return (
                <div
                  key={i}
                  className="bg-white rounded-2xl border border-gray-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.02)] overflow-hidden"
                >
                  <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-100">
                    <div className="p-4 sm:p-5">
                      <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                        Manager Evaluation Claim
                      </div>
                      <p className="text-xs text-gray-800 leading-relaxed font-medium">{c.claim}</p>
                    </div>

                    <div className="p-4 sm:p-5 bg-[#fbfcfd]">
                      <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                        Employee Project Evidence
                      </div>
                      <p className="text-xs text-gray-700 leading-relaxed">{c.evidence}</p>
                    </div>
                  </div>

                  {/* Finding Footer */}
                  <div className="px-5 py-3 border-t border-gray-100 flex items-center gap-2.5 bg-gray-50/50">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border text-[11px] font-bold uppercase tracking-wider ${cfg.badge}`}>
                      {cfg.icon} {c.status}
                    </span>
                    <span className="text-xs text-gray-600 font-medium">
                      — {c.finding}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Manager Feedback Note */}
          {selected.managerReview?.comment && (
            <div className="bg-white rounded-2xl border border-gray-200/80 p-5 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
              <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <MessageSquare size={13} className="text-blue-600" />
                Official Manager Endorsement Comment
              </div>
              <p className="text-xs text-gray-700 leading-relaxed italic bg-gray-50/80 p-3 rounded-xl border border-gray-100">
                "{selected.managerReview.comment}"
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
