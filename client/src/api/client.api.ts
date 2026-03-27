import { api } from './axios';
import type { ApiEnvelope } from '@/interfaces/auth';
import { ClientRoutes } from '@/constants/api-routes';

import type {
  ClientProfile,
  CreateClientProfileRequest,
  ProfileUpdateUrlRequest,
  ProfileUploadUrls,
  UpdateClientProfileRequest
} from '@/interfaces/client/client.interface';



export const clientApi = {
  
  async getProfile(): Promise<ApiEnvelope<ClientProfile>> {
    return (await api.get<ApiEnvelope<ClientProfile>>(ClientRoutes.PROFILE)).data;
  },

  async createProfile(data: CreateClientProfileRequest): Promise<ApiEnvelope<ClientProfile>> {
    return (await api.post<ApiEnvelope<ClientProfile>>(ClientRoutes.PROFILE, data)).data;
  },

  async updateProfile(data: UpdateClientProfileRequest): Promise<ApiEnvelope<ClientProfile>> {
    return (await api.put<ApiEnvelope<ClientProfile>>(ClientRoutes.PROFILE, data)).data;
  },

  async getUploadProfileUrl(data: ProfileUpdateUrlRequest ): Promise<ApiEnvelope<ProfileUploadUrls>>{
    return (await api.post<ApiEnvelope<ProfileUploadUrls>>(ClientRoutes.PROFILE_UPLOAD_URL, data)).data
  }
};