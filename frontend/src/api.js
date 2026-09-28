import axios from 'axios';

// Create an Axios instance with base backend API URL
const api = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// Request interceptor to automatically attach JWT token to every request
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

export default api;
