import api from './api';
import { API_ENDPOINTS } from '../config/api';

export const adminService = {
  // Get administrative telemetry & statistics
  getStats: async () => {
    const res = await api.get(API_ENDPOINTS.ADMIN_STATS);
    return res.data.data || res.data.Data || res.data;
  },

  // Get all company tickets (admin view)
  getTickets: async () => {
    const res = await api.get(API_ENDPOINTS.ADMIN_TICKETS);
    return res.data.data || res.data.Data || [];
  },

  // Get all registered users (admin view)
  getUsers: async () => {
    const res = await api.get(API_ENDPOINTS.ADMIN_USERS);
    return res.data.data || res.data.Data || [];
  },

  // Get escalated tickets (admin view)
  getEscalated: async () => {
    const res = await api.get(API_ENDPOINTS.ADMIN_ESCALATED);
    return res.data.data || res.data.Data || [];
  },
};

export default adminService;
