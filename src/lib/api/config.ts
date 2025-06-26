export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export const API_ENDPOINTS = {
  auth: {
    login: '/api/token/',
    refresh: '/api/token/refresh/',
    verify: '/api/token/verify/',
  },
  user: {
    users: '/api/user/users/',
    organizations: '/api/user/organizations/',
  },
  audit: {
    // Control Management
    controlTests: '/api/audit/control-tests/',
    controlResults: '/api/audit/control-results/',
    controlComments: '/api/audit/control-comments/',
    
    // Evidence Management
    evidence: '/api/audit/evidence/',
    parsedEvidence: '/api/audit/parsed-evidence/',
    ticktie: '/api/audit/ticktie/',
    
    // Workpaper Management
    workpapers: '/api/audit/workpapers/',
    workpaperSections: '/api/audit/workpaper-sections/',
    workpaperExports: '/api/audit/workpaper-exports/',
    
    // Exception Management
    exceptions: '/api/audit/exceptions/',
    exceptionNotes: '/api/audit/exception-notes/',
    remediations: '/api/audit/remediations/',
  },
  integration: {
    integrations: '/api/integration/integrations/',
    aiJobs: '/api/integration/ai-jobs/',
    aiAgents: '/api/integration/ai-agents/',
  },
  compliance: {
    auditLogs: '/api/logcompliance/audit-logs/',
    accessLogs: '/api/logcompliance/access-logs/',
  },
} as const;