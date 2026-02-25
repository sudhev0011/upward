import { api } from './axios';
import type { AuthResponseData, ApiEnvelope, GoogleLoginPayload, LoginPayload,RegisterPayload, VerifyOtpPayload, ResetPasswordPayload } from '@/interfaces/auth';

export const authApi = {
  async login(payload: LoginPayload): Promise<ApiEnvelope<AuthResponseData>> {
    return (await api.post<ApiEnvelope<AuthResponseData>>('/api/auth/login', payload)).data;
  },

//   async adminLogin(payload: LoginPayload): Promise<ApiEnvelope<AuthResponseData>> {
//     return (await api.post<ApiEnvelope<AuthResponseData>>(AuthRoutes.ADMIN_LOGIN, payload)).data;
//   },

  async register(payload: RegisterPayload): Promise<ApiEnvelope<AuthResponseData>> {
    return (await api.post<ApiEnvelope<AuthResponseData>>('/api/auth/register', payload)).data;
  },

  async forgotPassword(email: string): Promise<ApiEnvelope<AuthResponseData>> {
    return (await api.post<ApiEnvelope<AuthResponseData>>('/api/auth/forgot-password', { email })).data;
  },

  async resetPassword(payload: ResetPasswordPayload): Promise<ApiEnvelope<void>> {
    return (await api.post<ApiEnvelope<void>>('/api/auth/reset-password', payload)).data;
  },

  async requestOtp(email: string): Promise<ApiEnvelope<void>> {
    return (await api.post<ApiEnvelope<void>>('/api/auth/otp-request', { email })).data;
  },

  async verifyOtp(payload: VerifyOtpPayload): Promise<ApiEnvelope<AuthResponseData>> {
    return (await api.post<ApiEnvelope<AuthResponseData>>('/api/auth/otp-verify', payload)).data;
  },

  async googleLogin(payload: GoogleLoginPayload): Promise<ApiEnvelope<AuthResponseData>> {
    return (await api.post<ApiEnvelope<AuthResponseData>>('/api/auth/login/google', payload)).data;
  },

//   async refreshToken(): Promise<ApiEnvelope<AuthResponseData>> {
//     return (await api.post<ApiEnvelope<AuthResponseData>>('/api/auth/refresh', {})).data;
//   },

  async logout(): Promise<ApiEnvelope<void>> {
    return (await api.post<ApiEnvelope<void>>('/api/auth/logout', {})).data;
  },

  async checkAuth(): Promise<ApiEnvelope<AuthResponseData>>{
    return (await api.get<ApiEnvelope<AuthResponseData>>('/api/auth/check-auth',{})).data;
  }
}