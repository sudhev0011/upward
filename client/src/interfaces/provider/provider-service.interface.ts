// domain/queries/provider/ProviderServicesQueryModel.ts
export interface ProviderServicePublicItem {
  providerServiceId: string;
  serviceName: string;
  mode: string;
  maxHour: number | null;
  price: number;
  categoryName: string;
}