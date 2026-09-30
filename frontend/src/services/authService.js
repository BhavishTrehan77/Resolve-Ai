import api from './api';
import { API_ENDPOINTS } from '../config/api';

export const authService = {
  // Login user and return token
  login: async (email, password) => {
    const res = await api.post(API_ENDPOINTS.LOGIN, { email, password });
    return res.data;
  },

  // Signup new user
  signup: async (name, email, password) => {
    const res = await api.post(API_ENDPOINTS.SIGNUP, { name, email, password });
    return res.data;
  },

  // Forgot password request
  forgotPassword: async (email) => {
    const res = await api.post(API_ENDPOINTS.FORGOT, { email });
    return res.data;
  },

  // Reset password
  resetPassword: async (newPassword, token) => {
    const res = await api.post(API_ENDPOINTS.RESET, { newPassword, token });
    return res.data;
  },
};
