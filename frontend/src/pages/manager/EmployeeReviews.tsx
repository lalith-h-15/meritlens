import { Users, Info, CheckCircle2 } from 'lucide-react'

const DEMO_EMPLOYEES = [
  { id: 'e1', name: 'Anika Sharma', email: 'anika@example.com',  role: 'Junior Full-Stack Developer', status: 'Pending Review', department: 'Cloud Platform' },
  { id: 'e2', name: 'Raj Patel',    email: 'raj@example.com',    role: 'Junior Data Analyst',         status: 'Approved',       department: 'Analytics Core' },
  { id: 'e3', name: 'Mei Lin',      email: 'mei@example.com',    role: 'AI / ML Intern',              status: 'Pending Review', department: 'Enterprise AI' },
]

const statusColors: Record<string, string> = {
  'Pending Review': 'bg-amber-50 text-amber-700 border-amber-200',
  Approved:         'bg-emerald-50 text-emerald-700 border-emerald-200',
  Rejected:         'bg-red-50 text-red-700 border-red-200',
}

export default function EmployeeReviews() {
  return (
    <div className="space-y-6 font-[-apple-system,BlinkMacSystemFont,'SF_Pro_Display','Inter',sans-serif] animate-[fadeIn_0.4s_ease-out]">
      <div>
        <h2 className="text-xl font-bold text-gray-900 tracking-tight">Employee Roster & Reviews</h2>
        <p className="text-xs text-gray-400 mt-0.5">Track employee progress across Career Orchestrator runs and audit review cycles.</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.02)] overflow-hidden">
        <div className="px-5 py-3.5 border-b border-gray-100 flex items-center justify-between bg-[#fbfcfd]">
          <div className="flex items-center gap-2">
            <Users size={15} className="text-blue-600" />
            <span className="font-bold text-xs text-gray-900">Active Review Candidates</span>
          </div>
          <span className="text-[11px] font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
            {DEMO_EMPLOYEES.length} Members
          </span>
        </div>

        <div className="divide-y divide-gray-100">
          {DEMO_EMPLOYEES.map((emp) => (
            <div key={emp.id} className="flex items-center justify-between p-4 hover:bg-gray-50/60 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-sm shadow-blue-500/20">
                  {emp.name[0]}
                </div>
                <div>
                  <div className="text-xs font-bold text-gray-900">{emp.name}</div>
                  <div className="text-[11px] text-gray-400">{emp.email} · <span className="text-gray-500">{emp.department}</span></div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-xs text-gray-600 font-medium hidden sm:block">{emp.role}</div>
                <span className={`px-2.5 py-0.5 rounded-full border text-[11px] font-bold ${statusColors[emp.status]}`}>
                  {emp.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
