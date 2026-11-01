import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { OrchestratorProvider } from './context/OrchestratorContext'

// Auth pages
import LoginPage from './pages/auth/LoginPage'
import RegisterPage from './pages/auth/RegisterPage'

// Employee pages
import EmployeeDashboard from './pages/employee/Dashboard'
import CareerRoles from './pages/employee/CareerRoles'
import SkillsDiscovery from './pages/employee/SkillsDiscovery'
import MarketIntelligence from './pages/employee/MarketIntelligence'
import LearningPathways from './pages/employee/LearningPathways'
import InclusiveMatching from './pages/employee/InclusiveMatching'
import EmployerReadiness from './pages/employee/EmployerReadiness'
import BiasAudit from './pages/employee/BiasAudit'
import MyReviews from './pages/employee/MyReviews'
import Profile from './pages/employee/Profile'

// Manager pages
import ManagerDashboard from './pages/manager/Dashboard'
import EmployeeReviews from './pages/manager/EmployeeReviews'
import OrchestratorReviews from './pages/manager/OrchestratorReviews'
import MeritLensFindings from './pages/manager/MeritLensFindings'
import ReviewHistory from './pages/manager/ReviewHistory'

// Layouts
import EmployeeLayout from './layouts/EmployeeLayout'
import ManagerLayout from './layouts/ManagerLayout'

// Landing
import LandingPage from './pages/LandingPage'

function ProtectedRoute({ children, role }: { children: React.ReactNode; role?: 'employee' | 'manager' }) {
  const { user, loading } = useAuth()
  if (loading) return <div className="min-h-screen flex items-center justify-center"><Spinner /></div>
  if (!user) return <Navigate to="/login" replace />
  // If user role doesn't match, allow smooth transition instead of blank screen
  if (role && user.role !== role) {
    return <Navigate to={user.role === 'manager' ? '/manager' : '/employee'} replace />
  }
  return <>{children}</>
}

function Spinner() {
  return (
    <div className="w-8 h-8 border-3 border-gray-200 border-t-gray-800 rounded-full animate-spin" />
  )
}

function AppRoutes() {
  const { user, loading } = useAuth()
  if (loading) return <div className="min-h-screen flex items-center justify-center"><Spinner /></div>

  return (
    <Routes>
      {/* Root lands directly on the Folio AI Employee Home Dashboard */}
      <Route path="/" element={<Navigate to="/employee" replace />} />
      <Route path="/home" element={<Navigate to="/employee" replace />} />
      <Route path="/landing" element={<LandingPage />} />

      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Employee routes */}
      <Route path="/employee" element={<ProtectedRoute role="employee"><OrchestratorProvider><EmployeeLayout /></OrchestratorProvider></ProtectedRoute>}>
        <Route index element={<EmployeeDashboard />} />
        <Route path="profile" element={<Profile />} />
        <Route path="roles" element={<CareerRoles />} />
        <Route path="skills" element={<SkillsDiscovery />} />
        <Route path="market" element={<MarketIntelligence />} />
        <Route path="learning" element={<LearningPathways />} />
        <Route path="matching" element={<InclusiveMatching />} />
        <Route path="readiness" element={<EmployerReadiness />} />
        <Route path="bias" element={<BiasAudit />} />
        <Route path="reviews" element={<MyReviews />} />
      </Route>

      {/* Manager routes */}
      <Route path="/manager" element={<ProtectedRoute role="manager"><ManagerLayout /></ProtectedRoute>}>
        <Route index element={<ManagerDashboard />} />
        <Route path="employees" element={<EmployeeReviews />} />
        <Route path="orchestrator" element={<OrchestratorReviews />} />
        <Route path="findings" element={<MeritLensFindings />} />
        <Route path="meritlens" element={<MeritLensFindings />} />
        <Route path="history" element={<ReviewHistory />} />
      </Route>

      <Route path="*" element={<Navigate to="/employee" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  )
}
