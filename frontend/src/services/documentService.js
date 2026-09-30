import api from './api';
import { API_ENDPOINTS } from '../config/api';

export const documentService = {
  // Get all uploaded knowledge documents
  getAllDocuments: async () => {
    const res = await api.get(API_ENDPOINTS.DOCUMENTS);
    return res.data || [];
  },

  // Get single document
  getDocumentById: async (docId) => {
    const res = await api.get(API_ENDPOINTS.DOC_BY_ID(docId));
    return res.data;
  },

  // Upload document with PDF and metadata (FormData)
  uploadDocument: async (formData) => {
    const res = await api.post(API_ENDPOINTS.UPLOAD_DOC, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return res.data;
  },

  // Delete document
  deleteDocument: async (docId) => {
    const res = await api.delete(API_ENDPOINTS.DOC_BY_ID(docId));
    return res.data;
  },
};
