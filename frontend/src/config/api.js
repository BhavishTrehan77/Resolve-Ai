// API Configuration
// In local development, relative path '' uses Vite dev proxy (target: http://localhost:3000).
// In production, uses VITE_API_URL env var or defaults to the deployed Render backend URL.
export const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.DEV ? '' : 'https://resolve-ai-x6mn.onrender.com');

export const API_ENDPOINTS = {
  // Auth
  LOGIN: '/api/v1/login',
  SIGNUP: '/api/v1/signup',
  FORGOT: '/api/v1/forgot',
  RESET: '/api/v1/reset',

  // Tickets - General & Employee
  TICKETS: '/api/ticket',
  TICKET_BY_ID: (id) => `/api/ticket/${id}`,
  MY_TICKETS: '/api/ticket/my-tickets',
  MY_STATS: '/api/ticket/my/stats',

  // Tickets - Agent specific
  TICKETS_ASSIGNED: '/api/ticket/assigned',
  TICKETS_ESCALATED: '/api/ticket/escalated',
  AGENT_STATS: '/api/ticket/agent/stats',

  // Ticket Agent Operations
  ASSIGN_TICKET: (id) => `/api/ticket/${id}/assign`,
  AI_RESOLUTION: (id) => `/api/ticket/${id}/ai-resolution`,
  RESOLVE_TICKET: (id) => `/api/ticket/${id}/resolve`,

  // Admin Telemetry & Management
  ADMIN_STATS: '/api/admin/stats',
  ADMIN_TICKETS: '/api/admin/tickets',
  ADMIN_USERS: '/api/admin/users',
  ADMIN_ESCALATED: '/api/admin/escalated',

  // Comments
  COMMENTS: '/api/comm',
  COMMENTS_BY_TICKET: (ticketId) => `/api/comm/${ticketId}`,
  COMMENT_BY_ID: (commentId) => `/api/comm/${commentId}`,

  // Users
  USERS: '/api/user',
  USER_BY_ID: (id) => `/api/user/${id}`,

  // Knowledge Documents / Upload
  UPLOAD_DOC: '/api/upload/cdoc',
  DOCUMENTS: '/api/upload',
  DOC_BY_ID: (id) => `/api/upload/${id}`,

  // AI Assistant / RAG
  RAG_CHAT: '/api/rag/chat',

  // Incidents
  INCIDENTS: '/api/incident',
  INCIDENT_BY_ID: (id) => `/api/incident/${id}`,
};
