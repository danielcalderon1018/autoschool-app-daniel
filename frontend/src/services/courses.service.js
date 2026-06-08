import { api } from '@/lib/api';

export const coursesService = {
  getCourses: async (filters = {}) => {
    const response = await api.get('/courses/', { params: filters });
    return response.data.results || response.data;
  },

  getCourseById: async (id) => {
    const response = await api.get(`/courses/${id}/`);
    return response.data;
  },

  createCourse: async (data) => {
    const response = await api.post('/courses/', data);
    return response.data;
  },

  updateCourse: async (id, data) => {
    const response = await api.put(`/courses/${id}/`, data);
    return response.data;
  },

  partialUpdateCourse: async (id, data) => {
    const response = await api.patch(`/courses/${id}/`, data);
    return response.data;
  },

  deleteCourse: async (id) => {
    await api.delete(`/courses/${id}/`);
  },
};
