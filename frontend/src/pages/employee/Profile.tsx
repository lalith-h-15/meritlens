import { useAuth } from '../../context/AuthContext'
import { User, Mail, Target, Edit3, Save, Briefcase, CheckCircle2 } from 'lucide-react'
import { useState } from 'react'

export default function Profile() {
  const { user } = useAuth()
  const [editing, setEditing] = useState(false)
  const [goal, setGoal] = useState(user?.careerGoal ?? 'Principal Solutions Architect')

  const initials = user?.name?.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2) || 'BD'

  return (
    <div className="space-y-6 font-[-apple-system,BlinkMacSystemFont,'SF_Pro_Display','Inter',sans-serif] animate-[fadeIn_0.4s_ease-out]">
      <div>
        <h2 className="text-xl font-bold text-gray-900 tracking-tight">Account & Profile Settings</h2>
        <p className="text-xs text-gray-400 mt-0.5">Manage your personal credentials, departmental role, and target career objectives.</p>
      </div>

      {/* Avatar Card */}
      <div className="bg-white rounded-2xl border border-gray-200/80 p-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex flex-col sm:flex-row items-center sm:items-start gap-5">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white text-xl font-bold shadow-md shadow-blue-500/20 shrink-0">
          {initials}
        </div>

        <div className="flex-1 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-2">
            <h3 className="text-lg font-bold text-gray-900">{user?.name || 'Belia Norris'}</h3>
            <span className="w-2 h-2 rounded-full bg-emerald-500" title="Active Account" />
          </div>
          <p className="text-xs text-gray-500 mt-0.5">{user?.headline || 'SAP S/4HANA Solutions Lead'}</p>

          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-3">
            <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[11px] font-bold border border-blue-100">
              Verified Candidate
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-600 text-[11px] font-medium">
              {user?.department || 'Finance & Supply Chain'}
            </span>
          </div>
        </div>
      </div>

      {/* Account Info Details */}
      <div className="bg-white rounded-2xl border border-gray-200/80 p-5 shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-4">
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="p-3.5 rounded-xl bg-[#fbfcfd] border border-gray-100">
            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <User size={13} className="text-gray-400" /> Full Name
            </div>
            <div className="text-xs font-semibold text-gray-900">{user?.name || 'Belia Norris'}</div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#fbfcfd] border border-gray-100">
            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <Mail size={13} className="text-gray-400" /> Email Address
            </div>
            <div className="text-xs font-semibold text-gray-900">{user?.email || 'belia.norris@example.com'}</div>
          </div>
        </div>

        {/* Career Objective Editable */}
        <div className="p-4 rounded-xl bg-[#fbfcfd] border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
              <Target size={13} className="text-blue-600" /> Career Target Objective
            </div>
            <button
              onClick={() => setEditing(!editing)}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              {editing ? <Save size={13} /> : <Edit3 size={13} />}
              {editing ? 'Save' : 'Edit'}
            </button>
          </div>

          {editing ? (
            <input
              type="text"
              value={goal}
              onChange={e => setGoal(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-white border border-gray-200 rounded-lg outline-none focus:border-blue-500"
            />
          ) : (
            <div className="text-xs font-semibold text-gray-800">{goal}</div>
          )}
        </div>
      </div>
    </div>
  )
}
