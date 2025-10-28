import axios from 'axios';
import { toast } from 'react-toastify';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, 
});
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (!error.response) {
      if (error.code === 'ECONNABORTED') {
        toast.error('Request timeout. Please try again.');
      } else if (error.message === 'Network Error') {
        toast.error('Network error. Please check your connection.');
      } else {
        toast.error('Unable to connect to server. Please try again later.');
      }
      return Promise.reject(error);
    }

    const { status, data } = error.response;
    const currentPath = window.location.pathname;

    switch (status) {
      case 400:
        if (data?.message) {
          console.warn('Validation error:', data.message);
        }
        break;

      case 401: {
        const isProtectedRoute = currentPath.startsWith('/profile') ||
          currentPath.startsWith('/book') ||
          currentPath.startsWith('/admin');

        if (isProtectedRoute && currentPath !== '/signin') {
          localStorage.removeItem('user');
          localStorage.removeItem('token');
          localStorage.setItem('redirectAfterLogin', currentPath);

          toast.error('Session expired. Please sign in again.');
          setTimeout(() => {
            window.location.href = '/signin';
          }, 100);
        }
        break;
      }

      case 403:
        toast.error('You don\'t have permission to perform this action.');
        if (!currentPath.includes('/admin')) {
          setTimeout(() => {
            window.location.href = '/';
          }, 1500);
        }
        break;

      case 404:
        console.warn('Resource not found:', error.config?.url);
        break;

      case 409:
        if (data?.message) {
          toast.warn(data.message);
        }
        break;

      case 500:
      case 502:
      case 503:
      case 504:
        toast.error('Server error. Please try again later.');
        break;

      default:
        if (data?.message) {
          console.error('API Error:', data.message);
        }
        break;
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;