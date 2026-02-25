import axios from 'axios';
import { store } from '../store/store';
import { logout } from '../store/slices/authSlice';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true, // If using HTTP-only cookies
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor (Optional, keep if needed for other headers)
api.interceptors.request.use(
  (config) => {
    // Tokens are now handled via HTTP-Only cookies automatically
    // thanks to the 'withCredentials: true' setting above.
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling 401s and token expiration
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear Redux state and local storage
      store.dispatch(logout());
      
      // Optionally redirect to login page (handle securely depending on router context)
      // window.location.href = '/login';
    }
    return Promise.reject(error.response.data);
  }
);

export default api;
