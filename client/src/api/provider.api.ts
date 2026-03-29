import { api } from './axios';
import type { ApiEnvelope } from '@/interfaces/auth';
import type { ProviderProfile, UpdateProviderProfileRequest, CreateProviderProfileRequest } from '@/interfaces/provider/provider.interface';

import { ProviderRoutes } from '@/constants/api-routes';

export const providerApi = {
  
  async getProviderProfile(): Promise<ApiEnvelope<ProviderProfile>> {
    return (await api.get<ApiEnvelope<ProviderProfile>>(ProviderRoutes.PROFILE)).data;
  },

  async createProviderProfile(data: CreateProviderProfileRequest): Promise<ApiEnvelope<ProviderProfile>> {
    return (await api.post<ApiEnvelope<ProviderProfile>>(ProviderRoutes.PROFILE, data)).data;
  },

  async updateProviderProfile(data: UpdateProviderProfileRequest): Promise<ApiEnvelope<ProviderProfile>> {
    return (await api.put<ApiEnvelope<ProviderProfile>>(ProviderRoutes.PROFILE, data)).data;
  },

  async getUploadProfileUrl(data: { fileType: string }): Promise<ApiEnvelope<{ uploadUrl: string; fileUrl: string; }>> {
    return (await api.post<ApiEnvelope<{ uploadUrl: string; fileUrl: string; }>>(ProviderRoutes.PROFILE_UPLOAD_URL, data)).data;
  }
};
