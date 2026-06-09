export interface ProviderServicePublicItem {
  providerServiceId: string;
  serviceName: string;
  mode: string;
  maxHour: number | null;
  price: number;
  categoryName: string;
}

export interface SetProviderServicePriceRequest {
  providerServiceId: string;
  price: number;
  dailyCapacity: number | null;
}