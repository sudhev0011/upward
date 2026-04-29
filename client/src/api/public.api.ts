import { CategoryResponse } from "@/interfaces/admin/category.interface";
import { ApiEnvelope } from "@/interfaces/auth";
import { api } from "./axios";
import { PublicRoutes } from "@/constants/api-routes";
import { ServiceResponse } from "@/interfaces/admin/service.interface";

export const publicApi = {

    async getAllCategories(): Promise<ApiEnvelope<CategoryResponse[]>>{
        return (await api.get<ApiEnvelope<CategoryResponse[]>>(PublicRoutes.GET_CATEGORIES)).data
    },

    async getAllServices(): Promise<ApiEnvelope<ServiceResponse[]>>{
        return (await api.get<ApiEnvelope<ServiceResponse[]>>(PublicRoutes.GET_SERVICES)).data
    },

    async getServicesByCategory(categoryId: string): Promise<ApiEnvelope<ServiceResponse[]>>{
        return (await api.get<ApiEnvelope<ServiceResponse[]>>(PublicRoutes.GET_SERVICES_BY_CATEGORY.replace(':categoryId', categoryId))).data
    }
}