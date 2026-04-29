import { ProviderService } from "../../../../domain/entities/provider-service.entity";
import {
  InternalServerError,
  NotFoundError,
} from "../../../../domain/errors/errors";
import { IProviderServiceRepository } from "../../../../domain/interfaces/repositories/provider/IProviderServiceRepository";
import { ISetProviderServicePriceUseCase } from "../../../../domain/interfaces/usecases/provider/providerService/ISetProviderServicePriceUseCase";
import { setProviderServicePriceRequestDto } from "../../../dtos/provider/providerService/request/set-provider-service-price-request.dto";
import { ProviderServiceResponseDto } from "../../../dtos/provider/providerService/response/provider-service-response.dto";
import { ProviderServiceMapper } from "../../../mapers/provider/provider-service-mapper";

export class SetProviderServicePriceUseCase implements ISetProviderServicePriceUseCase {
  constructor(
    private readonly _providerServiceRepository: IProviderServiceRepository,
  ) {}

  async execute(
    data: setProviderServicePriceRequestDto,
  ): Promise<ProviderServiceResponseDto> {
    const providerService = await this._providerServiceRepository.findById(
      data.providerServiceId,
    );

    if (!providerService) {
      throw new NotFoundError(
        "Service not found: the selected service is not found, please select the service first.",
      );
    }

    const updatedProviderService = providerService.setPrice(data.price);

    const saved = await this._providerServiceRepository.update(
      updatedProviderService.id!,
      updatedProviderService,
    );

    if (!saved) {
      throw new InternalServerError("Database error");
    }

    return ProviderServiceMapper.toResponse(saved);
  }
}
