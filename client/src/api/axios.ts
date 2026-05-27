import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from "axios";
import { store } from "../store/store";
import { logout } from "../store/slices/authSlice";
import { ApiErrorResponse } from "@/interfaces/auth";
interface FailedRequest {
  resolve: (value: AxiosResponse | Promise<AxiosResponse>) => void;
  reject: (reason: AxiosError) => void;
}

interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

let isRefreshing = false;
let failedQueue: FailedRequest[] = [];

const processQueue = (error: AxiosError | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(null as unknown as AxiosResponse); 
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
  async (error: AxiosError<ApiErrorResponse>): Promise<AxiosResponse> => {
    const original = error.config as CustomAxiosRequestConfig;

    if (!error.response) {
      return Promise.reject(error);
    }

    const status = error.response.status;
    const message = error.response.data.message || "";

    
    if (status === 403 || message.includes("Invalid refresh token")) {
      store.dispatch(logout());
      return Promise.reject(error.response.data);
    }

    // C. Handle 401 Unauthorized / Token Expiration
    const isAuthError = status === 401 && 
      (message.includes('Missing access token') || message.includes('expired token'));

    if (isAuthError && !original?._retry) {
      if (isRefreshing) {
        return new Promise<AxiosResponse>((resolve, reject) => {
          failedQueue.push({
            resolve: () => resolve(api(original)),
            reject: (err: AxiosError) => reject(err),
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
        // Ensure the error we pass to the queue is an AxiosError
        const refreshError = axios.isAxiosError(err) 
          ? err 
          : new AxiosError("Refresh process failed");
          
        processQueue(refreshError);
        store.dispatch(logout());
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error?.response?.data);
  }
);