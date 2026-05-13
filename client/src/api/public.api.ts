import { CategoryResponse } from "@/interfaces/admin/category.interface";
import { ApiEnvelope } from "@/interfaces/auth";
import { api } from "./axios";
import { PublicRoutes } from "@/constants/api-routes";
import { ServiceResponse } from "@/interfaces/admin/service.interface";
import {
  GetProvidersByCategoryParams,
  ProviderListingResponse,
} from "@/interfaces/provider/provider.listing.interface";
import { PortfolioPageResponse } from "@/interfaces/provider/portfolio.interface";
import { AvailabilityResponse } from "@/interfaces/provider/availability.interface";
import { AvailabilityOverride } from "@/interfaces/provider/availability-override.interface";
import { Unavailability } from "@/interfaces/provider/unavailability.interface";
import { ProviderProfile } from "@/interfaces/provider/provider.interface";
import { ProviderServicePublicItem } from "@/interfaces/provider/provider-service.interface";

export const publicApi = {
  async getAllCategories(): Promise<ApiEnvelope<CategoryResponse[]>> {
    return (
      await api.get<ApiEnvelope<CategoryResponse[]>>(
        PublicRoutes.GET_CATEGORIES,
      )
    ).data;
  },

  async getAllServices(): Promise<ApiEnvelope<ServiceResponse[]>> {
    return (
      await api.get<ApiEnvelope<ServiceResponse[]>>(PublicRoutes.GET_SERVICES)
    ).data;
  },

  async getServicesByCategory(
    categoryId: string,
  ): Promise<ApiEnvelope<ServiceResponse[]>> {
    return (
      await api.get<ApiEnvelope<ServiceResponse[]>>(
        PublicRoutes.GET_SERVICES_BY_CATEGORY.replace(
          ":categoryId",
          categoryId,
        ),
      )
    ).data;
  },

  async getProvidersByCategory(
    params: GetProvidersByCategoryParams,
  ): Promise<ApiEnvelope<ProviderListingResponse>> {
    return (
      await api.get<ApiEnvelope<ProviderListingResponse>>(
        PublicRoutes.GET_PROVIDERS_BY_CATEGORY,
        { params },
      )
    ).data;
  },

  async getProviderPortfolio(
    providerId: string,
    page: number = 1,
    limit: number = 9,
  ): Promise<ApiEnvelope<PortfolioPageResponse>> {
    return (
      await api.get<ApiEnvelope<PortfolioPageResponse>>(
        PublicRoutes.GET_PROVIDER_PORTFOLIO.replace(':providerId', providerId),
        { params: { page, limit } },
      )
    ).data;
  },

  async getProviderAvailability(
    providerId: string,
  ): Promise<ApiEnvelope<AvailabilityResponse>> {
    return (
      await api.get<ApiEnvelope<AvailabilityResponse>>(
        PublicRoutes.GET_PROVIDER_AVAILABILITY.replace(
          ":providerId",
          providerId,
        ),
      )
    ).data;
  },

  async getProviderAvailabilityOverrides(
    providerId: string,
  ): Promise<ApiEnvelope<AvailabilityOverride[]>> {
    return (
      await api.get<ApiEnvelope<AvailabilityOverride[]>>(
        PublicRoutes.GET_PROVIDER_AVAILABILITY_OVERRIDES.replace(
          ":providerId",
          providerId,
        ),
      )
    ).data;
  },

  async getProviderUnavailability(
    providerId: string,
  ): Promise<ApiEnvelope<Unavailability[]>> {
    return (
      await api.get<ApiEnvelope<Unavailability[]>>(
        PublicRoutes.GET_PROVIDER_UNAVAILABILITY.replace(
          ":providerId",
          providerId,
        ),
      )
    ).data;
  },

  async getProviderProfile(
  providerId: string
): Promise<ApiEnvelope<ProviderProfile>> {
  return (
    await api.get<ApiEnvelope<ProviderProfile>>(
      PublicRoutes.GET_PROVIDER_PROFILE.replace(':providerId', providerId)
    )
  ).data;
},

// publicApi
async getProviderActiveServices(
  providerId: string
): Promise<ApiEnvelope<ProviderServicePublicItem[]>> {
  return (
    await api.get<ApiEnvelope<ProviderServicePublicItem[]>>(
      PublicRoutes.GET_PROVIDER_ACTIVE_SERVICES.replace(':providerId', providerId)
    )
  ).data;
},
};
