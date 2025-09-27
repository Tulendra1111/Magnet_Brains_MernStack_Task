import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://magnet-brains-mernstack-task-backend-xmmz.onrender.com/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (email, password) =>
    api.post('/auth/login', { email, password }),
  
  register: (name, email, password) =>
    api.post('/auth/register', { name, email, password }),
  
  getCurrentUser: () => api.get('/auth/me'),
};

// Users API
export const usersAPI = {
  getAll: () => api.get('/users'),
  getAssignable: () => api.get('/users/assignable'),
  getById: (id) => api.get(`/users/${id}`),
  create: (userData) => api.post('/users', userData),
  update: (id, userData) => api.put(`/users/${id}`, userData),
  delete: (id) => api.delete(`/users/${id}`),
};

// Tasks API
export const tasksAPI = {
  getAll: (params) => api.get('/tasks', { params }),
  
  getById: (id) => api.get(`/tasks/${id}`),
  
  create: (taskData) => api.post('/tasks', taskData),
  
  update: (id, taskData) => api.put(`/tasks/${id}`, taskData),
  
  delete: (id) => api.delete(`/tasks/${id}`),
  
  updateStatus: (id, status) => api.patch(`/tasks/${id}/status`, { status }),
  
  getByPriority: (priority, params) => api.get(`/tasks/priority/${priority}`, { params }),
};

export default api;
