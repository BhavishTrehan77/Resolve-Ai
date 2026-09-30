import api from './api';
import { API_ENDPOINTS } from '../config/api';

export const commentService = {
  // Get all comments for a ticket
  getCommentsByTicket: async (ticketId) => {
    const res = await api.get(API_ENDPOINTS.COMMENTS_BY_TICKET(ticketId));
    return res.data.data || res.data.T || res.data.Data || [];
  },

  // Post a new comment
  createComment: async (ticketId, message) => {
    const res = await api.post(API_ENDPOINTS.COMMENTS_BY_TICKET(ticketId), {
      ticketId,
      message,
      content: message,
    });
    return res.data.data || res.data.D || res.data.Data;
  },

  // Delete comment
  deleteComment: async (commentId) => {
    const res = await api.delete(API_ENDPOINTS.COMMENT_BY_ID(commentId));
    return res.data.data || res.data.D || res.data.Data;
  },
};

export default commentService;
