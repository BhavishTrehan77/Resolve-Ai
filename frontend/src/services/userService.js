import api from './api';
import { API_ENDPOINTS } from '../config/api';

export const userService = {
  // Get all users (Admin)
  getUsers: async () => {
    const res = await api.get(API_ENDPOINTS.USERS);
    return res.data.data || [];
  },

  // Get user by ID
  getUserById: async (id) => {
    const res = await api.get(API_ENDPOINTS.USER_BY_ID(id));
    return res.data.data;
  },

  // Create new user/agent (Admin)
  createUser: async (userData) => {
    const res = await api.post(API_ENDPOINTS.USERS, userData);
    return res.data.data;
  },

  // Update user
  updateUser: async (id, userData) => {
    const res = await api.patch(API_ENDPOINTS.USER_BY_ID(id), userData);
    return res.data;
  },

  // Delete user
  deleteUser: async (id) => {
    const res = await api.delete(API_ENDPOINTS.USER_BY_ID(id));
    return res.data.data;
  },
};
