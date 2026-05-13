import { ProviderServicePublicItem } from "../../../../queries/client/provider-service-public-item";

export interface IGetActiveProviderServicesUseCase {
  execute(providerId: string): Promise<ProviderServicePublicItem[]>;
}