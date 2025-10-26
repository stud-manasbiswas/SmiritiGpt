import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
};

export const chatAPI = {
  sendMessage: (data) => api.post('/chat/message', data),
  uploadDocument: (data) => api.post('/chat/upload-document', data),
  uploadFile: (formData) => api.post('/chat/upload-file', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  executeCode: (data) => api.post('/chat/execute-code', data),
};

export const conversationAPI = {
  create: (data) => api.post('/conversations', data),
  getAll: () => api.get('/conversations'),
  getMessages: (id) => api.get(`/conversations/${id}/messages`),
  delete: (id) => api.delete(`/conversations/${id}`),
  share: (id) => api.post(`/conversations/${id}/share`),
  getShared: (token) => api.get(`/conversations/shared/${token}`),
  summarize: (id) => api.get(`/conversations/${id}/summarize`),
};

export default api;