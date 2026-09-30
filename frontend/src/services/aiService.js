import api from './api';
import { API_ENDPOINTS } from '../config/api';

export const aiService = {
  // Query the RAG AI knowledge base
  askRag: async (query) => {
    const res = await api.post(API_ENDPOINTS.RAG_CHAT, { query });
    return res.data.ans;
  },
};
