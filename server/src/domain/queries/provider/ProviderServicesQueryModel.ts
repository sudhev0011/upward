import { ProviderServiceStatus } from "../../enums/provider-service.status.enum";
import { ServiceMode } from "../../entity.types";

export type ProviderServicesGroupedData = {
  category: {
    id: unknown; 
    name: string;
  };

  services: {
    providerServiceId: unknown;
    serviceId: unknown;
    serviceName: string;
    mode: ServiceMode;
    maxHour: number;
    price: number | null;
    status: ProviderServiceStatus;
    isActive: boolean;
  }[];
};