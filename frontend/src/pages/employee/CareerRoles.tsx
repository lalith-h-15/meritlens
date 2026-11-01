import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useOrchestrator, Role } from '../../context/OrchestratorContext'
import { Briefcase, CheckCircle2, Star, ArrowRight, Zap, Sparkles } from 'lucide-react'

export default function CareerRoles() {
  const { roles, selectedRole, fetchRoles, selectRole, loading, runOrchestrator, error } = useOrchestrator()
  const navigate = useNavigate()

  useEffect(() => { if (!roles.length) fetchRoles() }, [])

  const handleSelect = (role: Role) => selectRole(role)

  const handleRun = async () => {
    await runOrchestrator()
    navigate('/employee/skills')
  }

  const demoRoles: Role[] = [
    {
      id: 'junior-fullstack',
      title: 'Junior Full-Stack Developer',
      description: 'Build end-to-end web applications using modern frameworks and cloud services.',
      requiredSkills: [
        { name: 'JavaScript', level: 'Intermediate', priority: 'essential' },
        { name: 'React', level: 'Intermediate', priority: 'essential' },
        { name: 'Node.js', level: 'Beginner', priority: 'essential' },
        { name: 'SQL', level: 'Beginner', priority: 'preferred' },
        { name: 'Git', level: 'Intermediate', priority: 'preferred' },
      ]
    },
    {
      id: 'junior-data-analyst',
      title: 'Junior Data Analyst',
      description: 'Analyse datasets, build reports, and surface insights to drive business decisions.',
      requiredSkills: [
        { name: 'Python', level: 'Intermediate', priority: 'essential' },
        { name: 'SQL', level: 'Intermediate', priority: 'essential' },
        { name: 'Excel', level: 'Advanced', priority: 'essential' },
        { name: 'Tableau', level: 'Beginner', priority: 'preferred' },
        { name: 'Statistics', level: 'Intermediate', priority: 'preferred' },
      ]
    },
    {
      id: 'ai-ml-intern',
      title: 'AI / Machine Learning Intern',
      description: 'Apply ML techniques to real business problems under senior mentorship.',
      requiredSkills: [
        { name: 'Python', level: 'Intermediate', priority: 'essential' },
        { name: 'Machine Learning', level: 'Beginner', priority: 'essential' },
        { name: 'TensorFlow', level: 'Beginner', priority: 'preferred' },
        { name: 'Mathematics', level: 'Intermediate', priority: 'essential' },
        { name: 'Data Wrangling', level: 'Beginner', priority: 'preferred' },
      ]
    },
  ]

  const displayRoles = roles.length ? roles : demoRoles

  return (
    <div className="space-y-6 font-[-apple-system,BlinkMacSystemFont,'SF_Pro_Display','Inter',sans-serif] animate-[fadeIn_0.4s_ease-out]">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 tracking-tight">Applications & Role Feed</h2>
        <p className="text-xs text-gray-400 mt-0.5">Browse available roles, select your target, and trigger your AI career match.</p>
      </div>

      {/* Role Cards Grid */}
      <div className="grid md:grid-cols-3 gap-4">
        {displayRoles.map((role) => {
          const isSelected = selectedRole?.id === role.id
          return (
            <div
              key={role.id}
              onClick={() => handleSelect(role)}
              className={`bg-white rounded-2xl border p-5 cursor-pointer transition-all duration-200 relative group flex flex-col justify-between ${
                isSelected
                  ? 'border-blue-600 shadow-[0_4px_20px_rgba(37,99,235,0.08)] ring-2 ring-blue-500/10'
                  : 'border-gray-200/80 hover:border-gray-300 hover:shadow-[0_4px_16px_rgba(0,0,0,0.03)]'
              }`}
            >
              <div>
                <div className="flex items-start justify-between mb-3.5">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${
                    isSelected ? 'bg-blue-600 text-white' : 'bg-blue-50 text-blue-600 group-hover:bg-blue-100/80'
                  }`}>
                    <Briefcase size={16} />
                  </div>
                  {isSelected && (
                    <span className="flex items-center gap-1 text-[11px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                      <CheckCircle2 size={12} /> Selected
                    </span>
                  )}
                </div>

                <h3 className="font-bold text-[14px] text-gray-900 mb-1.5 leading-snug">{role.title}</h3>
                <p className="text-xs text-gray-500 mb-4 leading-relaxed">{role.description}</p>

                <div className="space-y-1.5 pt-3 border-t border-gray-100">
                  <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Required Skills</div>
                  {role.requiredSkills?.slice(0, 4).map(s => (
                    <div key={s.name} className="flex items-center justify-between text-xs">
                      <span className="text-gray-700">{s.name}</span>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[11px] text-gray-400">{s.level}</span>
                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${
                          s.priority === 'essential' ? 'bg-blue-50 text-blue-700' : 'bg-gray-100 text-gray-600'
                        }`}>
                          {s.priority === 'essential' ? 'Essential' : 'Preferred'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={(e) => { e.stopPropagation(); handleSelect(role) }}
                className={`mt-5 w-full py-2 rounded-xl text-xs font-semibold transition-all ${
                  isSelected
                    ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20'
                    : 'border border-gray-200 text-gray-700 hover:bg-gray-50'
                }`}
              >
                {isSelected ? 'Role Selected' : 'Select Role'}
              </button>
            </div>
          )
        })}
      </div>

      {/* Action CTA Bar */}
      {selectedRole && (
        <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-blue-800 rounded-2xl p-5 text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm shadow-blue-700/10">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white shrink-0">
              <Zap size={18} />
            </div>
            <div>
              <div className="font-bold text-sm text-white">Trigger Live AI Analysis</div>
              <div className="text-xs text-blue-100 mt-0.5">
                Mapping skills and readiness for <span className="font-semibold text-white underline underline-offset-2">{selectedRole.title}</span>
              </div>
            </div>
          </div>

          <button
            onClick={handleRun}
            disabled={loading}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gray-900 hover:bg-black text-white text-xs font-semibold shadow-sm transition-all flex items-center justify-center gap-2 shrink-0 disabled:opacity-50"
          >
            {loading ? <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Sparkles size={14} />}
            {loading ? 'Analyzing…' : 'Start Auto-Applied'}
            {!loading && <ArrowRight size={13} />}
          </button>
        </div>
      )}
    </div>
  )
}
