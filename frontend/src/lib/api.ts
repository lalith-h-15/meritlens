import axios from 'axios'

const BASE_URL = 'http://localhost:5100'

export const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
})

// Attach token on every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Handle 401 globally
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      const token = localStorage.getItem('token')
      if (token && !token.startsWith('demo-')) {
        localStorage.removeItem('token')
      }
    }
    return Promise.reject(err)
  }
)

// ── Auth ──────────────────────────────────────────────────────────────────
export const authAPI = {
  register: (data: { name: string; email: string; password: string; careerGoal?: string }) =>
    api.post('/api/v1/auth/register', data),
  login: (email: string, password: string) =>
    api.post('/api/v1/auth/login', { email, password }),
  me: () => api.get('/api/v1/auth/me'),
}

// ── Orchestrator ─────────────────────────────────────────────────────────
export const orchestratorAPI = {
  getRoles: () => api.get('/api/v1/orchestrator/roles'),
  getMyContext: () => api.get('/api/v1/orchestrator/employees/me/context'),
  updateMyContext: (data: unknown) => api.put('/api/v1/orchestrator/employees/me/context', data),
  getEmployeeContext: (id: string) => api.get(`/api/v1/orchestrator/employees/${id}/context`),
  runOrchestrator: (roleId: string) => api.post('/api/v1/orchestrator/runs', { roleId }),
  getRun: (runId: string) => api.get(`/api/v1/orchestrator/runs/${runId}`),
  reviewRun: (runId: string, decision: string, comment: string) =>
    api.post(`/api/v1/orchestrator/runs/${runId}/review`, { decision, comment }),
}
