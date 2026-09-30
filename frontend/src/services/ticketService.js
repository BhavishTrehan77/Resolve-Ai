import api from './api';
import { API_ENDPOINTS } from '../config/api';

export const ticketService = {
  // Fetch all tickets
  getAllTickets: async () => {
    const res = await api.get(API_ENDPOINTS.TICKETS);
    return res.data.data || res.data.Data || [];
  },

  // Get a single ticket by its MongoDB ID
  getTicketById: async (id) => {
    const res = await api.get(API_ENDPOINTS.TICKET_BY_ID(id));
    return res.data.data || res.data.Data;
  },

  // Create a new ticket (triggers the AI orchestra in backend)
  createTicket: async (ticketData) => {
    const res = await api.post(API_ENDPOINTS.TICKETS, ticketData);
    return res.data.data || res.data.Data;
  },

  // Get current logged-in employee tickets
  getMyTickets: async () => {
    const res = await api.get(API_ENDPOINTS.MY_TICKETS);
    return res.data.data || res.data.Data || [];
  },

  // Get current employee ticket statistics
  getMyStats: async () => {
    const res = await api.get(API_ENDPOINTS.MY_STATS);
    return res.data.data || res.data.Data;
  },

  // Agent: Fetch tickets assigned to the logged-in agent
  getAssignedTickets: async () => {
    const res = await api.get(API_ENDPOINTS.TICKETS_ASSIGNED);
    return res.data.data || res.data.Data || [];
  },

  // Agent: Fetch escalated tickets requiring human review
  getEscalatedTickets: async () => {
    const res = await api.get(API_ENDPOINTS.TICKETS_ESCALATED);
    return res.data.data || res.data.Data || [];
  },

  // Agent: Fetch agent workload & resolution telemetry
  getAgentStats: async () => {
    const res = await api.get(API_ENDPOINTS.AGENT_STATS);
    return res.data.data || res.data.Data;
  },

  // Assign ticket to agent
  assignTicket: async (ticketId, agentId) => {
    const res = await api.post(API_ENDPOINTS.ASSIGN_TICKET(ticketId), { agentId });
    return res.data.data || res.data.Data;
  },

  // Review & modify AI-generated resolution
  updateAiResolution: async (ticketId, resolution, steps = []) => {
    const res = await api.put(API_ENDPOINTS.AI_RESOLUTION(ticketId), { resolution, steps });
    return res.data.data || res.data.Data;
  },

  // Mark ticket as resolved
  resolveTicket: async (ticketId) => {
    const res = await api.put(API_ENDPOINTS.RESOLVE_TICKET(ticketId));
    return res.data.data || res.data.Data;
  },

  // Update ticket properties (status, priority, etc.)
  updateTicket: async (id, updateData) => {
    const res = await api.patch(API_ENDPOINTS.TICKET_BY_ID(id), updateData);
    return res.data.data || res.data.Data;
  },

  // Delete ticket (Admin only)
  deleteTicket: async (id) => {
    const res = await api.delete(API_ENDPOINTS.TICKET_BY_ID(id));
    return res.data.data || res.data.Data;
  },
};

export default ticketService;
