import { ProviderService } from "../../../../domain/entities/provider-service.entity";
import { ConflictError, LimitError } from "../../../../domain/errors/errors";
import { IProviderSubscriptionRepository } from "../../../../domain/interfaces/repositories/provider-subscription/IProviderSubscriptionRepository";
import { IProviderServiceRepository } from "../../../../domain/interfaces/repositories/provider/IProviderServiceRepository";
import { ICreateProviderServiceUseCase } from "../../../../domain/interfaces/usecases/provider/providerService/ICreateProviderServiceUseCase";
import { CreateProviderServiceRequestDto } from "../../../dtos/provider/providerService/request/create-provider-service-request.dto";
import { ProviderServiceResponseDto } from "../../../dtos/provider/providerService/response/provider-service-response.dto";
import { ProviderServiceMapper } from "../../../mapers/provider/provider-service-mapper";

export class CreateProviderServiceUseCase implements ICreateProviderServiceUseCase {
  constructor(
    private readonly _providerServiceRepository: IProviderServiceRepository,
    private readonly _providerSubscriptionRepository: IProviderSubscriptionRepository,
  ) {}
  async execute(
    data: CreateProviderServiceRequestDto,
  ): Promise<ProviderServiceResponseDto> {
    const existed = await this._providerServiceRepository.findOne({
      serviceId: data.serviceId,
      providerId: data.providerId
    });

    if (existed) {
      throw new ConflictError(
        "A service with this ID is already linked to your provider account.",
      );
    }

    const limits =
      await this._providerSubscriptionRepository.getActivePlanLimitsByProvider(
        data.providerId,
      );
    const currentServiceCount =
      await this._providerServiceRepository.servicesCountByProvider(
        data.providerId,
      );

    if (currentServiceCount >= limits.maxServices) {
      throw new LimitError(
        `Limit reached. Your active plan only allows up to ${limits.maxServices} services.`,
      );
    }

    const providerService = ProviderService.create(data);

    const result =
      await this._providerServiceRepository.create(providerService);

    return ProviderServiceMapper.toResponse(result);
  }
}
