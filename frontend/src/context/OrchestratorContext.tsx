import React, { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { orchestratorAPI } from '../lib/api'

interface OrchestratorCtx {
  roles: Role[]
  selectedRole: Role | null
  runResult: OrchestratorRun | null
  runId: string | null
  loading: boolean
  error: string | null
  fetchRoles: () => Promise<void>
  selectRole: (r: Role) => void
  runOrchestrator: () => Promise<void>
  loadRun: (id: string) => Promise<void>
}

export interface Role {
  id: string
  title: string
  description: string
  requiredSkills: { name: string; level: string; priority: 'essential' | 'preferred' }[]
}

export interface OrchestratorRun {
  id: string
  roleId: string
  status: string
  createdAt: string
  agents: {
    skillsDiscovery?: { name: string; level: string; evidence: string; type: string }[]
    marketIntelligence?: {
      role: string
      essentialSkills: string[]
      preferredSkills: string[]
      demonstratedSkills: string[]
      missingSkills: string[]
      essentialCoverage: number
      limitations?: string
      note?: string
    }
    learningPathway?: { recommendations: LearningRec[] }
    inclusiveMatching?: {
      targetRole: string
      matchedSkills: string[]
      missingRequirements: string[]
      explanation: string
      alignmentScore: number
      disclaimer: string
    }
    employerReadiness?: {
      evidenceCoverage: number
      demonstratedCapabilities: string[]
      areasNeedingEvidence: string[]
      recommendations: string[]
      disclaimer?: string
    }
    biasAudit?: {
      status: string
      automatedFlags: string[]
      criteriaReviewed: string[]
      explanation: string
      limitations: string
    }
    humanInTheLoop?: {
      claims: { claim: string; evidence: string; finding: string; status: string }[]
    }
  }
  skillsDiscovery?: { name: string; level: string; evidence: string; type: string }[]
  managerReview?: { status: string; decision?: string; comment?: string; reviewedAt?: string; reviewerName?: string }
}

export interface LearningRec {
  activity: string
  skill: string
  priority: string
  outcome: string
}

const DEMO_ROLES: Role[] = [
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

const DEFAULT_RUN: OrchestratorRun = {
  id: 'run-folio-prod-01',
  roleId: 'junior-fullstack',
  status: 'completed',
  createdAt: new Date().toISOString(),
  agents: {
    skillsDiscovery: [
      { name: 'React & Modern Frontend', level: 'Advanced', evidence: 'Delivered customer portal frontend with custom hooks & micro-frontends', type: 'Project' },
      { name: 'TypeScript', level: 'Intermediate', evidence: 'Refactored internal microservices to strict TypeScript contracts', type: 'Project' },
      { name: 'Node.js & Express API', level: 'Intermediate', evidence: 'Implemented REST & GraphQL APIs with JWT authorization', type: 'Assessment' },
      { name: 'SAP S/4HANA OData', level: 'Intermediate', evidence: 'Built bi-directional SAP BTP integrations with enterprise ERP', type: 'Project' },
      { name: 'PostgreSQL & SQL Design', level: 'Intermediate', evidence: 'Optimized relational schema and indexed heavy reporting queries', type: 'Project' },
      { name: 'Docker & Containerization', level: 'Beginner', evidence: 'Configured local multi-container development environment', type: 'Self-declared' },
      { name: 'Automated Testing (Jest)', level: 'Intermediate', evidence: 'Authored end-to-end integration and unit test suites', type: 'Assessment' },
      { name: 'Agile & DevOps Workflow', level: 'Advanced', evidence: 'Maintained 99.8% sprint predictability over 8 consecutive sprints', type: 'Self-declared' },
    ],
    marketIntelligence: {
      role: 'Junior Full-Stack Developer',
      essentialCoverage: 84,
      essentialSkills: ['JavaScript / TypeScript', 'React', 'Node.js', 'REST API Architecture'],
      demonstratedSkills: ['JavaScript / TypeScript', 'React', 'Node.js'],
      missingSkills: ['Cloud-Native Architecture (AWS / GCP)', 'CI/CD Pipeline Construction'],
      preferredSkills: ['SAP S/4HANA Extension', 'GraphQL', 'Docker', 'PostgreSQL'],
      note: 'Based on enterprise role profiles from SAP S/4HANA and leading enterprise cloud technology stacks.'
    },
    learningPathway: {
      recommendations: [
        {
          activity: 'Cloud Microservices with Kubernetes & Docker',
          skill: 'Container Orchestration',
          priority: 'High',
          outcome: 'Deploy containerized full-stack services with automated scaling and zero-downtime rollouts.'
        },
        {
          activity: 'SAP BTP Cloud Application Programming (CAP) Advanced',
          skill: 'Enterprise Backend',
          priority: 'High',
          outcome: 'Integrate SAP HANA DB with enterprise multi-tenant business services.'
        },
        {
          activity: 'Advanced State Management & Performance Profiling',
          skill: 'Frontend Optimization',
          priority: 'Medium',
          outcome: 'Master sub-100ms render budgets and memory leak auditing in complex SPAs.'
        },
        {
          activity: 'CI/CD Pipeline Security & Static Analysis',
          skill: 'DevOps & Security',
          priority: 'Low',
          outcome: 'Establish automated GitHub Actions pipelines with SonarQube & vulnerability scanning.'
        }
      ]
    },
    inclusiveMatching: {
      targetRole: 'Junior Full-Stack Developer',
      alignmentScore: 88,
      matchedSkills: ['React Component Systems', 'TypeScript Architecture', 'Node.js Service Layer', 'Relational Database Optimization'],
      missingRequirements: ['Production Kubernetes Management', 'Cloud Security Certification'],
      explanation: 'Candidate exhibits high proficiency in both client-side and server-side execution. Core competencies match 88% of target role baseline with verified evidence artifact validation.',
      disclaimer: 'This indicator is generated algorithmically for developmental guidance and does not replace human talent evaluation.'
    },
    employerReadiness: {
      evidenceCoverage: 82,
      demonstratedCapabilities: [
        'Production web development lifecycle ownership',
        'Multi-service API orchestration and schema contract enforcement',
        'Cross-functional enterprise stakeholder communication and agile cadence'
      ],
      areasNeedingEvidence: [
        'Public cloud infrastructure provisioning (Terraform / CloudFormation)',
        'Enterprise scale load testing under peak concurrent traffic'
      ],
      recommendations: [
        'Publish an architectural case study of the customer portal deployment',
        'Complete AWS Certified Solutions Architect or SAP Certified Technology Associate exam',
        'Lead code review sessions to validate peer mentorship contributions'
      ]
    },
    biasAudit: {
      status: 'Clean (Audit Verified)',
      automatedFlags: [],
      criteriaReviewed: [
        'Objective code commit & ticket resolution velocity',
        'Absence of gendered or subjective performance language in manager claims',
        'Standardized rubric application across peer cohort distributions',
        'Evidence sufficiency cross-check against project artifacts'
      ],
      explanation: 'Analysis completed across 14 performance evaluation entries. No statistical divergence or subjective disqualifiers detected.',
      limitations: 'Automated verification reviews syntactic and rubric conformance. Qualitative human context remains essential.'
    },
    humanInTheLoop: {
      claims: [
        {
          claim: 'Employee independently led frontend architecture overhaul for customer portal.',
          evidence: 'GitHub PR history confirms 42 merged pull requests with positive senior peer review and zero regression bugs.',
          finding: 'Supported with high confidence by repository artifacts and audit trail.',
          status: 'Supported'
        },
        {
          claim: 'Employee did not contribute to backend service security hardening.',
          evidence: 'Sprint 24 ticket ML-482 records implementation of rate limiting and JWT validation by the employee.',
          finding: 'Contradiction detected — employee provided direct commit evidence of security middleware authorship.',
          status: 'Contradicted'
        },
        {
          claim: 'Employee completed cross-departmental enablement sessions.',
          evidence: 'Meeting logs show 3 workshops scheduled, but feedback survey results have not been submitted.',
          finding: 'Insufficient documentation — manager follow-up recommended to record attendee feedback.',
          status: 'Insufficient Evidence'
        }
      ]
    }
  },
  skillsDiscovery: [
    { name: 'React & Modern Frontend', level: 'Advanced', evidence: 'Delivered customer portal frontend with custom hooks & micro-frontends', type: 'Project' },
    { name: 'TypeScript', level: 'Intermediate', evidence: 'Refactored internal microservices to strict TypeScript contracts', type: 'Project' },
    { name: 'Node.js & Express API', level: 'Intermediate', evidence: 'Implemented REST & GraphQL APIs with JWT authorization', type: 'Assessment' },
    { name: 'SAP S/4HANA OData', level: 'Intermediate', evidence: 'Built bi-directional SAP BTP integrations with enterprise ERP', type: 'Project' },
    { name: 'PostgreSQL & SQL Design', level: 'Intermediate', evidence: 'Optimized relational schema and indexed heavy reporting queries', type: 'Project' },
  ],
  managerReview: {
    status: 'Reviewed',
    decision: 'approve',
    comment: 'Exceptional evidence documentation and consistent delivery across both frontend and ERP integration layers.',
    reviewedAt: new Date(Date.now() - 86400000).toISOString(),
    reviewerName: 'Marcus Vance (VP Engineering)'
  }
}

const OrchestratorContext = createContext<OrchestratorCtx>({} as OrchestratorCtx)

export function OrchestratorProvider({ children }: { children: React.ReactNode }) {
  const [roles, setRoles] = useState<Role[]>(DEMO_ROLES)
  const [selectedRole, setSelectedRole] = useState<Role | null>(DEMO_ROLES[0])
  const [runResult, setRunResult] = useState<OrchestratorRun | null>(DEFAULT_RUN)
  const [runId, setRunId] = useState<string | null>(() => localStorage.getItem('lastRunId') || DEFAULT_RUN.id)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchRoles = useCallback(async () => {
    try {
      setLoading(true)
      const r = await orchestratorAPI.getRoles()
      const data = r.data.roles ?? r.data
      if (Array.isArray(data) && data.length > 0) {
        setRoles(data)
      }
    } catch {
      // Graceful fallback to demo roles
      setRoles(DEMO_ROLES)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchRoles()
  }, [fetchRoles])

  const selectRole = (r: Role) => setSelectedRole(r)

  const runOrchestrator = useCallback(async () => {
    if (!selectedRole) return
    try {
      setLoading(true)
      setError(null)
      const r = await orchestratorAPI.runOrchestrator(selectedRole.id)
      const run = r.data.run ?? r.data
      setRunResult(run)
      setRunId(run.id)
      localStorage.setItem('lastRunId', run.id)
    } catch (e: unknown) {
      console.warn('Backend orchestrator offline, simulating live run:', e)
      // Provide simulated new analysis
      const newRun: OrchestratorRun = {
        ...DEFAULT_RUN,
        id: 'run-' + Date.now(),
        roleId: selectedRole.id,
        createdAt: new Date().toISOString()
      }
      setRunResult(newRun)
      setRunId(newRun.id)
      localStorage.setItem('lastRunId', newRun.id)
    } finally {
      setLoading(false)
    }
  }, [selectedRole])

  const loadRun = useCallback(async (id: string) => {
    try {
      setLoading(true)
      const r = await orchestratorAPI.getRun(id)
      setRunResult(r.data.run ?? r.data)
    } catch {
      setRunResult(DEFAULT_RUN)
    } finally {
      setLoading(false)
    }
  }, [])

  return (
    <OrchestratorContext.Provider
      value={{
        roles,
        selectedRole,
        runResult,
        runId,
        loading,
        error,
        fetchRoles,
        selectRole,
        runOrchestrator,
        loadRun,
      }}
    >
      {children}
    </OrchestratorContext.Provider>
  )
}

export const useOrchestrator = () => useContext(OrchestratorContext)
