import { ProviderService } from "../../../../domain/entities/provider-service.entity";
import { ConflictError } from "../../../../domain/errors/errors";
import { IProviderServiceRepository } from "../../../../domain/interfaces/repositories/provider/IProviderServiceRepository";
import { ICreateProviderServiceUseCase } from "../../../../domain/interfaces/usecases/provider/providerService/ICreateProviderServiceUseCase";
import { CreateProviderServiceRequestDto } from "../../../dtos/provider/providerService/request/create-provider-service-request.dto";
import { ProviderServiceResponseDto } from "../../../dtos/provider/providerService/response/provider-service-response.dto";
import { ProviderServiceMapper } from "../../../mapers/provider/provider-service-mapper";

export class CreateProviderServiceUseCase implements ICreateProviderServiceUseCase {
  constructor(
    private readonly _providerServiceRepository: IProviderServiceRepository,
  ) {}
  async execute(
    data: CreateProviderServiceRequestDto,
  ): Promise<ProviderServiceResponseDto> {
    const existed = await this._providerServiceRepository.findOne({
      serviceId: data.serviceId,
    });

    if (existed) {
      throw new ConflictError("Provider service already exists");
    }

    const providerService = ProviderService.create(data);

    const result =
      await this._providerServiceRepository.create(providerService);

    return ProviderServiceMapper.toResponse(result);
  }
}
