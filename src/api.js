import axios from 'axios';

// Vite uses import.meta.env instead of process.env.
// Fallback to process.env if you are using Create React App with a polyfill.
const getBaseURL = () => {
  if (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  if (typeof process !== 'undefined' && process.env?.REACT_APP_API_URL) {
    return process.env.REACT_APP_API_URL;
  }
  return 'http://127.0.0.1:8000/api';
};
export const startCheckout = async () => {
  const { data } = await API.post('/payments/create-checkout-session/', {
    frontend_url: window.location.origin,
  });
  if (data.url) {
    window.location.href = data.url;
  }
};

const API = axios.create({
  baseURL: getBaseURL(),
});

// Request Interceptor: Attach JWT Access Token
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('access');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response Interceptor: Auto-Refresh Expired Tokens
API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Check for 401 Unauthorized error and ensure retry flag isn't set yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem('refresh');

      if (refreshToken) {
        try {
          // Use plain axios instance so interceptors don't loop on failure
          const { data } = await axios.post(
            `${API.defaults.baseURL}/auth/refresh/`,
            { refresh: refreshToken }
          );

          // Save new access token
          localStorage.setItem('access', data.access);

          // Retry the original request with the new access token
          originalRequest.headers.Authorization = `Bearer ${data.access}`;
          return API(originalRequest);
        } catch (refreshError) {
          // Clear session on refresh failure and redirect to login
          localStorage.removeItem('access');
          localStorage.removeItem('refresh');
          window.location.href = '/login';
          return Promise.reject(refreshError);
        }
      }
    }

    return Promise.reject(error);
  }
);

export default API;