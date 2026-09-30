import api from './api';
import { API_ENDPOINTS } from '../config/api';

export const incidentService = {
  // Fetch all archived incident postmortems
  getAllIncidents: async () => {
    const res = await api.get(API_ENDPOINTS.INCIDENTS);
    // Backend returns { Data: [...] }
    return res.data.Data || [];
  },

  // Get incident by ID
  getIncidentById: async (id) => {
    const res = await api.get(API_ENDPOINTS.INCIDENT_BY_ID(id));
    return res.data.Data;
  },

  // Create an incident postmortem from a resolved ticket
  createIncident: async (incidentData) => {
    const res = await api.post(API_ENDPOINTS.INCIDENTS, incidentData);
    return res.data.Data;
  },

  // Update incident
  updateIncident: async (id, data) => {
    const res = await api.patch(API_ENDPOINTS.INCIDENT_BY_ID(id), data);
    return res.data.Data;
  },

  // Delete incident
  deleteIncident: async (id) => {
    const res = await api.delete(API_ENDPOINTS.INCIDENT_BY_ID(id));
    return res.data.Data;
  },
};
