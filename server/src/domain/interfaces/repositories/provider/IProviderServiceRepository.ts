import { ProviderService } from "../../../entities/provider-service.entity";
import { ProviderServicesGroupedData } from "../../../queries/provider/ProviderServicesQueryModel";
import { IBaseRepository } from "../base/IBaseRepository";
import { PaginatedResult } from "../../../common.types";
import { ProviderServicePublicItem } from "../../../queries/client/provider-service-public-item";

export interface IProviderServiceRepository extends IBaseRepository<ProviderService> {
  findByProvider(providerId: string): Promise<ProviderService[]>;

  findByProviderAndService(
    providerId: string,
    serviceId: string,
  ): Promise<ProviderService | null>;

  findActive(
    providerId: string,
    serviceId: string,
  ): Promise<ProviderService | null>;

  findGroupedByCategory(
    providerId: string,
    params: {
      page?: number;
      limit?: number;
      search?: string;
      isActive?: boolean;
      mode?: "onsite" | "offsite" | "both";
      sortBy?: string;
      sortOrder?: "asc" | "desc";
    },
  ): Promise<PaginatedResult<ProviderServicesGroupedData>>;

  getActiveServicesByProvider(
    providerId: string,
  ): Promise<ProviderServicePublicItem[]>;

  servicesCountByProvider(providerId: string): Promise<number>;

  hasOtherServicesInSameCategory(providerServiceId: string): Promise<{
    hasOtherServices: boolean;
    categoryId: string;
    categoryName: string;
    providerId: string;
  }>;
}
