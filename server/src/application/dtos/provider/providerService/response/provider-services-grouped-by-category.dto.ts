import { ServiceMode } from "../../../../../domain/entity.types";
import { ProviderServiceStatus } from "../../../../../domain/enums/provider-service.status.enum";

export interface ProviderServicesGroupedByCategoryDto {
  category: {
    id: string;
    name: string;
  };

  services: {
    providerServiceId: string;
    serviceId: string;
    serviceName: string;
    mode: ServiceMode;
    maxHour: number;
    price: number | null;
    status: ProviderServiceStatus;
    isActive: boolean;
  }[];
}
export interface PaginatedProviderServicesGroupedByCategoryDto {
  data: ProviderServicesGroupedByCategoryDto[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
