import { api } from './axios';
import type { ApiEnvelope } from '@/interfaces/auth';
import type { ProviderProfile, UpdateProviderProfileRequest, CreateProviderProfileRequest } from '@/interfaces/provider/provider.interface';
import type { SubmitKycIdentityRequest, SaveKycBankRequest, UploadKycDocumentResponse, ProviderKycDocument, providerBankDocument } from '@/interfaces/provider/kyc.interface';

import { ProviderRoutes } from '@/constants/api-routes';
import { CreateProviderServiceResponse, PaginatedProviderServicesGroupedByCategory, SetProviderServicePriceRequest } from '@/interfaces/admin/provider-service.interface';
import type {
  SetAvailabilityRequest,
  AvailabilityResponse
} from '@/interfaces/provider/availability.interface';

import type {
  CreateUnavailabilityRequest,
  Unavailability
} from '@/interfaces/provider/unavailability.interface';

import type {
  SetAvailabilityOverrideRequest,
  AvailabilityOverride
} from '@/interfaces/provider/availability-override.interface';


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
  },

  async createProviderService(data: {serviceId: string}): Promise<ApiEnvelope<CreateProviderServiceResponse>>{
    return (await api.post<ApiEnvelope<CreateProviderServiceResponse>>(ProviderRoutes.CREATE_PROVIDE_SERVICE, data) ).data
  },

  async setProviderServicePrice(data: SetProviderServicePriceRequest): Promise<ApiEnvelope<CreateProviderServiceResponse>>{
    return (await api.patch<ApiEnvelope<CreateProviderServiceResponse>>(ProviderRoutes.SET_PROVIDER_SERVICE_PRICE, data)).data
  },

  async getProviderServiceGroupedByCategory(params: {
    page?: number;
    limit?: number;
    search?: string;
    isActive?: boolean;
    mode?: "onsite" | "offsite" | "both";
    sortBy?: "name" | "createdAt";
    sortOrder?: "asc" | "desc";
  }):Promise<ApiEnvelope<PaginatedProviderServicesGroupedByCategory>>{
    return (await api.get<ApiEnvelope<PaginatedProviderServicesGroupedByCategory>>(ProviderRoutes.GET_ALL_PROVIDER_SERVICE_BY_CATEGORY,{params})).data
  },

  async deleteProviderServiceById(id: string):Promise<ApiEnvelope<void>>{
    return (await api.delete<ApiEnvelope<void>>(ProviderRoutes.DELETE_PROVIDER_SERVICE.replace(':id', id))).data
  },



  async setAvailability(
  data: SetAvailabilityRequest
): Promise<ApiEnvelope<AvailabilityResponse>> {
  return (
    await api.put<ApiEnvelope<AvailabilityResponse>>(
      ProviderRoutes.SET_AVAILABILITY,
      data
    )
  ).data;
},

async getAvailability(): Promise<ApiEnvelope<AvailabilityResponse>> {
  return (
    await api.get<ApiEnvelope<AvailabilityResponse>>(
      ProviderRoutes.GET_AVAILABILITY
    )
  ).data;
},

async createUnavailability(
  data: CreateUnavailabilityRequest
): Promise<ApiEnvelope<Unavailability>> {
  return (
    await api.post<ApiEnvelope<Unavailability>>(
      ProviderRoutes.CREATE_UNAVAILABILITY,
      data
    )
  ).data;
},



async deleteUnavailability(id: string): Promise<ApiEnvelope<void>> {
  return (
    await api.delete<ApiEnvelope<void>>(
      ProviderRoutes.DELETE_UNAVAILABILITY.replace(':id', id)
    )
  ).data;
},


async getUnavailability(): Promise<ApiEnvelope<Unavailability[]>> {
  return (
    await api.get<ApiEnvelope<Unavailability[]>>(
      ProviderRoutes.GET_UNAVAILABILITY
    )
  ).data;
},


async getAvailabilityOverrides(): Promise<ApiEnvelope<AvailabilityOverride[]>> {
  return (
    await api.get<ApiEnvelope<AvailabilityOverride[]>>(
      ProviderRoutes.GET_AVAILABILITY_OVERRIDES
    )
  ).data;
},


async setAvailabilityOverride(
  data: SetAvailabilityOverrideRequest
): Promise<ApiEnvelope<AvailabilityOverride>> {
  return (
    await api.put<ApiEnvelope<AvailabilityOverride>>(
      ProviderRoutes.SET_AVAILABILITY_OVERRIDE,
      data
    )
  ).data;
},


async deleteAvailabilityOverride(date: string): Promise<ApiEnvelope<void>> {
  return (
    await api.delete<ApiEnvelope<void>>(
      ProviderRoutes.DELETE_AVAILABILITY_OVERRIDE.replace(':date', date)
    )
  ).data;
},

};
