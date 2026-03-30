import { api } from './axios';
import type { ApiEnvelope } from '@/interfaces/auth';
import type { ProviderProfile, UpdateProviderProfileRequest, CreateProviderProfileRequest } from '@/interfaces/provider/provider.interface';
import type { SubmitKycIdentityRequest, SaveKycBankRequest, UploadKycDocumentResponse, ProviderKycDocument, providerBankDocument } from '@/interfaces/provider/kyc.interface';

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
  },

  async submitKycIdentity(data: SubmitKycIdentityRequest): Promise<ApiEnvelope<void>> {
    return (await api.post<ApiEnvelope<void>>(ProviderRoutes.KYC_IDENTITY, data)).data;
  },

  async saveKycBank(data: SaveKycBankRequest): Promise<ApiEnvelope<void>> {
    return (await api.post<ApiEnvelope<void>>(ProviderRoutes.KYC_BANK, data)).data;
  },

  async uploadKycDocument(data: { fileType: string }): Promise<ApiEnvelope<UploadKycDocumentResponse>> {
    return (await api.post<ApiEnvelope<UploadKycDocumentResponse>>(ProviderRoutes.KYC_DOCUMENT_UPLOAD, data)).data;
  },

  async getKycDocument(): Promise<ApiEnvelope<ProviderKycDocument>>{
    return (await api.get<ApiEnvelope<ProviderKycDocument>>(ProviderRoutes.GET_KYC_DOCUMENT)).data
  },

  async getBankDocument(): Promise<ApiEnvelope<providerBankDocument>>{
    return (await api.get<ApiEnvelope<providerBankDocument>>(ProviderRoutes.GET_BANK_DOCUMENT)).data
  }
};
