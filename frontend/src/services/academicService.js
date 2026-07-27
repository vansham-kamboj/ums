import api from './api';

export const academicService = {
  getSessions: async (params) => {
    const res = await api.get('/academic', { params });
    return res.data;
  },
  createSession: async (data) => {
    const res = await api.post('/academic', data);
    return res.data;
  },
  updateSession: async (id, data) => {
    const res = await api.put(`/academic/${id}`, data);
    return res.data;
  },
  deleteSession: async (id) => {
    const res = await api.delete(`/academic/${id}`);
    return res.data;
  },
  archiveSession: async (id) => {
    const res = await api.put(`/academic/sessions/${id}/archive`);
    return res.data;
  },
  unarchiveSession: async (id) => {
    const res = await api.put(`/academic/sessions/${id}/unarchive`);
    return res.data;
  }
};
