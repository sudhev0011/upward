import { IProviderServiceRepository } from "../../../../domain/interfaces/repositories/provider/IProviderServiceRepository";
import { IGetActiveProviderServicesUseCase } from "../../../../domain/interfaces/usecases/provider/providerService/IGetActiveProviderServicesUseCase";
import { ProviderServicePublicItem } from "../../../../domain/queries/client/provider-service-public-item";


export class GetActiveProviderServicesUseCase implements IGetActiveProviderServicesUseCase {
  constructor(
    private readonly _providerServiceRepository: IProviderServiceRepository,
  ) {}

  async execute(providerId: string): Promise<ProviderServicePublicItem[]> {
    return this._providerServiceRepository.getActiveServicesByProvider(providerId);
  }
}