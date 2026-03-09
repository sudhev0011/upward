import { api } from './axios';
import type { AuthResponseData, ApiEnvelope, GoogleLoginPayload, LoginPayload,RegisterPayload, VerifyOtpPayload, ResetPasswordPayload } from '@/interfaces/auth';
import { AuthRoutes } from '@/constants/api-routes';
export const authApi = {
  async login(payload: LoginPayload): Promise<ApiEnvelope<AuthResponseData>> {
    return (await api.post<ApiEnvelope<AuthResponseData>>(AuthRoutes.LOGIN, payload)).data;
  },

  async adminLogin(payload: LoginPayload): Promise<ApiEnvelope<AuthResponseData>> {
    return (await api.post<ApiEnvelope<AuthResponseData>>(AuthRoutes.ADMIN_LOGIN, payload)).data;
  },

  async register(payload: RegisterPayload): Promise<ApiEnvelope<AuthResponseData>> {
    return (await api.post<ApiEnvelope<AuthResponseData>>(AuthRoutes.REGISTER, payload)).data;
  },

  async forgotPassword(email: string): Promise<ApiEnvelope<AuthResponseData>> {
    return (await api.post<ApiEnvelope<AuthResponseData>>(AuthRoutes.FORGOT_PASSWORD, { email })).data;
  },

  async resetPassword(payload: ResetPasswordPayload): Promise<ApiEnvelope<void>> {
    return (await api.post<ApiEnvelope<void>>(AuthRoutes.RESET_PASSWORD, payload)).data;
  },

  async changePassword(currentPassword: string, newPassword: string): Promise<ApiEnvelope<void>> {
    return (await api.post<ApiEnvelope<void>>(AuthRoutes.CHANGE_PASSWORD, {
      currentPassword,
      newPassword,
    })).data;
  },

  async requestOtp(email: string): Promise<ApiEnvelope<void>> {
    return (await api.post<ApiEnvelope<void>>(AuthRoutes.OTP_REQUEST, { email })).data;
  },

  async verifyOtp(payload: VerifyOtpPayload): Promise<ApiEnvelope<AuthResponseData>> {
    return (await api.post<ApiEnvelope<AuthResponseData>>(AuthRoutes.OTP_VERIFY, payload)).data;
  },

  async googleLogin(payload: GoogleLoginPayload): Promise<ApiEnvelope<AuthResponseData>> {
    return (await api.post<ApiEnvelope<AuthResponseData>>(AuthRoutes.GOOGLE_LOGIN, payload)).data;
  },

  async refreshToken(): Promise<ApiEnvelope<AuthResponseData>> {
    return (await api.post<ApiEnvelope<AuthResponseData>>(AuthRoutes.REFRESH, {})).data;
  },

  async logout(): Promise<ApiEnvelope<void>> {
    return (await api.post<ApiEnvelope<void>>(AuthRoutes.LOGOUT, {})).data;
  },

  async checkAuth(): Promise<ApiEnvelope<AuthResponseData>>{
    return (await api.get<ApiEnvelope<AuthResponseData>>(AuthRoutes.CHECK_AUTH,{})).data;
  }
}