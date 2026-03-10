import axios from "axios";
import { store } from "../store/store";
import { logout } from "../store/slices/authSlice";

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve();
    }
  });

  failedQueue = [];
};

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;
    const status = error?.response?.status;
    const message = error?.response?.data?.message || "";

    if (!status) {
      console.log(message)
      return Promise.reject(error?.response?.data);
    }

    if (status === 403 || message.includes("Invalid refresh token")) {
      store.dispatch(logout());
      return Promise.reject(error?.response?.data);
    }

    if (status === 401 && message.includes('Missing access token') && !original._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: () => resolve(api(original)),
            reject,
          });
        });
      }

      original._retry = true;
      isRefreshing = true;

      try {
        await api.post("/api/auth/refresh");

        processQueue(null);
        return api(original);
      } catch (err) {
        processQueue(err);
        store.dispatch(logout());
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }
    
    return Promise.reject(error?.response?.data);
  }
);