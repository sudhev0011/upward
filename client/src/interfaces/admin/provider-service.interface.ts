export interface CreateProviderServiceResponse {
  id: string;
  providerId: string;
  serviceId: string;
  price: number | null;
  status: "draft" | "active" | "inactive";
  createdAt: Date;
  updatedAt: Date;
}

export interface SetProviderServicePriceRequest {
  providerServiceId: string;
  price: number;
}

export interface Services {
  providerServiceId: string;
  serviceId: string;
  serviceName: string;
  mode: "onstie" | "offsite" | "both";
  maxHour: number;
  price: number | null;
  status: "draft" | "active" | "inactive";
}

export interface ProviderServicesGroupedByCategory {
  category: {
    id: string;
    name: string;
  };

  services: Services[];
}

export interface PaginatedProviderServicesGroupedByCategory {
  data: ProviderServicesGroupedByCategory[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
