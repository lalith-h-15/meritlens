import { Link } from 'react-router-dom'
import { ArrowRight, CheckCircle2, Zap, Shield, BarChart2, Users, Globe, Star, Sparkles, Compass, Check } from 'lucide-react'

const features = [
  { icon: Zap,       title: 'Auto-Applied AI Matching', desc: 'Continuous career matching that discovers your skills, maps growth, and matches verified roles in real-time.' },
  { icon: Shield,    title: 'Career Orchestrator Verification',    desc: 'Audits performance reviews against project repositories and ticket artifacts for bias-free recognition.' },
  { icon: BarChart2, title: 'Market Intelligence',       desc: 'Benchmarked against live tech stacks from SAP, cloud hyperscalers, and leading tech enterprises.' },
  { icon: Users,     title: 'Inclusive Progression',    desc: 'Standardized rubric matching that eliminates subjective bias and ensures transparent evaluations.' },
]

const partners = ['SAP S/4HANA', 'Deloitte Digital', 'Accenture', 'IBM Cloud', 'Infosys', 'Wipro']

const stats = [
  { value: '10,000+', label: 'Verified Profiles' },
  { value: '96%',     label: 'Review Accuracy Rate' },
  { value: '3x',      label: 'Faster Skill Gap Closure' },
  { value: '50+',     label: 'Enterprise Deployments' },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-gray-900 font-[-apple-system,BlinkMacSystemFont,'SF_Pro_Display','Inter',sans-serif] selection:bg-blue-100 selection:text-blue-900">
      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100 transition-all">
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-sm shadow-blue-500/20">
              <Sparkles size={15} />
            </div>
            <span className="font-bold text-[15px] tracking-tight text-gray-900">
              Career <span className="text-blue-600">Orchestrator</span>
            </span>
          </div>

          <div className="hidden md:flex items-center gap-8 text-[13px] text-gray-500 font-medium">
            <a href="#features" className="hover:text-gray-900 transition-colors">Platform</a>
            <a href="#how" className="hover:text-gray-900 transition-colors">How it works</a>
            <a href="#partners" className="hover:text-gray-900 transition-colors">Partners</a>
          </div>

          <div className="flex items-center gap-3">
            <Link to="/login" className="text-[13px] font-medium text-gray-600 hover:text-gray-900 px-3.5 py-2 rounded-xl hover:bg-gray-50 transition-all">
              Sign in
            </Link>
            <Link to="/employee" className="flex items-center gap-1.5 text-[13px] font-semibold text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-xl shadow-sm shadow-blue-500/20 active:scale-[0.98] transition-all">
              Open Dashboard <ArrowRight size={13} />
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden pt-20 pb-24 md:pt-28 md:pb-32 bg-gradient-to-b from-[#f8faff] via-white to-white">
        <div className="relative max-w-5xl mx-auto px-6 text-center animate-[fadeIn_0.6s_ease-out]">
          <div className="inline-flex items-center gap-2 bg-white border border-gray-200/80 shadow-[0_2px_8px_rgba(0,0,0,0.03)] rounded-full px-3.5 py-1.5 text-xs text-gray-600 mb-8 backdrop-blur animate-[slideUp_0.4s_cubic-bezier(0.16,1,0.3,1)]">
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
            <span className="font-semibold text-gray-800">Next-Gen AI Career Orchestrator & Review Verification</span>
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-[66px] font-extrabold text-gray-900 tracking-tight leading-[1.08] mb-6 animate-[slideUp_0.5s_cubic-bezier(0.16,1,0.3,1)]">
            Target career matches,<br />
            <span className="bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
              verified by evidence.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-gray-500 max-w-2xl mx-auto mb-10 leading-relaxed font-normal animate-[slideUp_0.55s_cubic-bezier(0.16,1,0.3,1)]">
            Auto-applied role matching with zero subjective bias. Career Orchestrator proves your contributions through validated commit logs, project deliverables, and verified peer metrics.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 animate-[slideUp_0.6s_cubic-bezier(0.16,1,0.3,1)]">
            <Link to="/employee" className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold shadow-sm shadow-blue-500/20 active:scale-[0.98] transition-all">
              Launch Live Workspace <ArrowRight size={15} />
            </Link>
            <Link to="/login" className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white hover:bg-gray-50 border border-gray-200/80 text-gray-700 text-sm font-semibold shadow-[0_1px_3px_rgba(0,0,0,0.02)] active:scale-[0.98] transition-all">
              Sign In
            </Link>
          </div>

          {/* Autohire / Career Orchestrator Preview Window Card */}
          <div className="mt-14 max-w-4xl mx-auto bg-white rounded-3xl border border-gray-200/80 shadow-[0_20px_50px_rgba(0,0,0,0.08)] overflow-hidden text-left p-6 sm:p-7 animate-[slideUp_0.65s_cubic-bezier(0.16,1,0.3,1)]">
            {/* Header row in preview */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-gray-100 mb-5">
              <div>
                <div className="text-base font-bold text-gray-900">Highest Matches · Live Pipeline</div>
                <div className="text-xs text-gray-400">Continuous background queue matching active</div>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 font-bold text-xs border border-blue-100">
                  96% Top Alignment
                </span>
                <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 font-bold text-xs border border-emerald-100">
                  Audit Verified
                </span>
              </div>
            </div>

            {/* Blue Banner preview inside mockup */}
            <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-blue-800 rounded-2xl p-5 text-white mb-4">
              <div className="font-bold text-sm">Analyzing your profile & contributions...</div>
              <div className="text-xs text-blue-100 mt-0.5">Matching you with relevant opportunities across enterprise cloud engineering.</div>
            </div>

            {/* Micro table preview */}
            <div className="space-y-2">
              {[
                { role: 'Full-Stack Software Engineer', company: 'SAP Cloud Platform', match: '96%', type: 'Full-time · Remote' },
                { role: 'Frontend Architect (React & TS)', company: 'Deloitte Digital', match: '94%', type: 'Full-time · Hybrid' },
                { role: 'Enterprise Cloud Application Dev', company: 'IBM Systems Lab', match: '89%', type: 'Contract · Remote' },
              ].map(item => (
                <div key={item.role} className="flex items-center justify-between p-3 rounded-xl bg-gray-50/80 border border-gray-100 text-xs font-medium">
                  <div className="font-semibold text-gray-900">{item.role}</div>
                  <div className="text-gray-500 hidden sm:block">{item.company}</div>
                  <div className="text-gray-400 text-[11px]">{item.type}</div>
                  <span className="font-bold text-blue-600">{item.match} Match</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Metrics */}
      <section className="max-w-6xl mx-auto px-6 py-12 border-y border-gray-100">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map(({ value, label }) => (
            <div key={label} className="text-center">
              <div className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight mb-1">{value}</div>
              <div className="text-xs sm:text-sm text-gray-400 font-medium">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <div className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-2">
            Core Architecture
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight mb-3">
            Designed for total career clarity and fair review auditing
          </h2>
          <p className="text-sm sm:text-base text-gray-500 max-w-xl mx-auto">
            Combining real-time AI talent orchestration with tamper-proof review verification.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="bg-white rounded-2xl border border-gray-200/80 p-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)] hover:border-blue-500 hover:shadow-md transition-all group"
            >
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <Icon size={18} />
              </div>
              <h3 className="font-bold text-sm text-gray-900 mb-1.5">{title}</h3>
              <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 text-gray-400 text-xs py-8">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-blue-600 flex items-center justify-center text-white text-[10px] font-bold">
              CO
            </div>
            <span className="font-bold text-gray-900">Career Orchestrator</span>
          </div>
          <div>© 2026 Career Orchestrator. All rights reserved.</div>
        </div>
      </footer>
    </div>
  )
}
