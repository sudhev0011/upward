import { ApproveProviderRequest, BlockProviderRequest, ProviderProfilesResponse, RejectProviderRequest } from "@/interfaces/admin/provider.interface";
import { ApiEnvelope } from "@/interfaces/auth";
import { api } from "./axios";
import { AdminRoutes } from "@/constants/api-routes";
import { ProviderProfile } from "@/interfaces/provider/provider.interface";
import { BlockClientRequest, ClientProfilesResponse } from "@/interfaces/admin/client.interface";
import { ClientProfile } from "@/interfaces/client/client.interface";
import { ProviderKycDocument } from "@/interfaces/provider/kyc.interface";

export const adminApi = {

    async getAllProviders(params: any): Promise<ApiEnvelope<ProviderProfilesResponse>>{
        return (await api.get<ApiEnvelope<ProviderProfilesResponse>>(AdminRoutes.GET_PROVIDER_PROFILES,{params})).data
    },

    async getProviderDetails(id: string): Promise<ApiEnvelope<ProviderProfile>>{
        return (await api.get<ApiEnvelope<ProviderProfile>>(AdminRoutes.GET_PROVIDER_PROFILE_BY_ID.replace(':id', id))).data
    },

    async approveProvider(data: ApproveProviderRequest): Promise<ApiEnvelope<void>>{

        return (await api.patch<ApiEnvelope<void>>(AdminRoutes.APPROVE_PROVIDER,data)).data
    },

    async rejectProvider(data: RejectProviderRequest): Promise<ApiEnvelope<void>>{
        return (await api.put<ApiEnvelope<void>>(AdminRoutes.APPROVE_REJECT, data)).data
    },

    async blockProvider(data: BlockProviderRequest): Promise<ApiEnvelope<void>>{
        return (await api.patch<ApiEnvelope<void>>(AdminRoutes.BLOCK_PROVIDER,data)).data
    },

    async getAllClients(params: any): Promise<ApiEnvelope<ClientProfilesResponse>>{
        return (await api.get<ApiEnvelope<ClientProfilesResponse>>(AdminRoutes.GET_CLIENT_PROFILES,{params})).data
    },

    async getClientDetails(id: string): Promise<ApiEnvelope<ClientProfile>>{
        return (await api.get<ApiEnvelope<ClientProfile>>(AdminRoutes.GET_CLIENT_PROFILE_BY_ID.replace(':id',id))).data
    },

    async blockClient(data:BlockClientRequest): Promise<ApiEnvelope<void>>{
        return (await api.patch<ApiEnvelope<void>>(AdminRoutes.BLOCK_CLIENT,data)).data
    },
    async getKycDocument(userId: string): Promise<ApiEnvelope<ProviderKycDocument>>{
        return (await api.get<ApiEnvelope<ProviderKycDocument>>(AdminRoutes.GET_KYC_DOCUMENT.replace(':userId',userId))).data
      },
}