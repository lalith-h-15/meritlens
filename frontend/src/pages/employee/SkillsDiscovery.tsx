import { useOrchestrator } from '../../context/OrchestratorContext'
import { Link } from 'react-router-dom'
import { Star, Database, FileCode, User, ArrowRight, AlertCircle, Sparkles, CheckCircle2 } from 'lucide-react'

const levelColors: Record<string, string> = {
  Beginner:     'bg-amber-50 text-amber-700 border border-amber-200/80',
  Intermediate: 'bg-blue-50 text-blue-700 border border-blue-200/80',
  Advanced:     'bg-emerald-50 text-emerald-700 border border-emerald-200/80',
  Expert:       'bg-indigo-50 text-indigo-700 border border-indigo-200/80',
}

const typeIcons: Record<string, React.ReactNode> = {
  Assessment:      <Database size={12} className="text-blue-500" />,
  Project:         <FileCode size={12} className="text-indigo-500" />,
  'Self-declared': <User size={12} className="text-gray-400" />,
}

export default function SkillsDiscovery() {
  const { runResult, loading } = useOrchestrator()

  const raw = runResult?.agents?.skillsDiscovery ?? runResult?.skillsDiscovery
  const skills = Array.isArray(raw) ? raw as { name: string; level: string; evidence: string; type: string }[] : []

  return (
    <div className="space-y-6 font-[-apple-system,BlinkMacSystemFont,'SF_Pro_Display','Inter',sans-serif] animate-[fadeIn_0.4s_ease-out]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-gray-900 tracking-tight">JobAI Learn · Skills Discovery</h2>
          <p className="text-xs text-gray-400 mt-0.5">Identified competencies verified through project artifacts, assessments, and code contributions.</p>
        </div>
        <Link
          to="/employee/roles"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gray-900 hover:bg-black text-white text-xs font-semibold shadow-sm transition-all self-start sm:self-auto"
        >
          <Sparkles size={13} />
          New Analysis
        </Link>
      </div>

      {skills.length > 0 && (
        <>
          {/* Summary Metric Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
            {(['Beginner', 'Intermediate', 'Advanced', 'Expert'] as const).map((level) => {
              const count = skills.filter(s => s.level === level).length
              return (
                <div
                  key={level}
                  className="bg-white rounded-2xl border border-gray-200/80 p-4 shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">{level}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${levelColors[level]}`}>
                      {count} skills
                    </span>
                  </div>
                  <div className="text-2xl font-extrabold text-gray-900">{count}</div>
                  <div className="text-[11px] text-gray-400 mt-0.5">Verified evidence</div>
                </div>
              )
            })}
          </div>

          {/* Clean Data Table */}
          <div className="bg-white rounded-2xl border border-gray-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.02)] overflow-hidden">
            <div className="px-5 py-3.5 border-b border-gray-100 flex items-center justify-between bg-[#fbfcfd]">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={15} className="text-blue-600" />
                <span className="font-bold text-xs text-gray-900">All Identified Competencies</span>
              </div>
              <span className="text-[11px] font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                {skills.length} Total
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-100 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                    <th className="py-3 px-5">Skill Name</th>
                    <th className="py-3 px-5">Proficiency</th>
                    <th className="py-3 px-5">Evidence Artifact</th>
                    <th className="py-3 px-5">Origin Type</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-xs">
                  {skills.map((s, i) => (
                    <tr key={i} className="hover:bg-blue-50/30 transition-colors">
                      <td className="py-3.5 px-5 font-semibold text-gray-900">
                        {s.name}
                      </td>
                      <td className="py-3.5 px-5">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold ${levelColors[s.level] || 'bg-gray-100 text-gray-600'}`}>
                          {s.level}
                        </span>
                      </td>
                      <td className="py-3.5 px-5 text-gray-600 max-w-md leading-relaxed">
                        {s.evidence}
                      </td>
                      <td className="py-3.5 px-5">
                        <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-gray-50 border border-gray-100 text-gray-700 font-medium text-[11px]">
                          {typeIcons[s.type] ?? <User size={12} />}
                          <span>{s.type}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
