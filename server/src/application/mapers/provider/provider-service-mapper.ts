import { ProviderService } from "../../../domain/entities/provider-service.entity";
import { EntityNotPersistedError } from "../../../domain/errors/errors";
import { ProviderServiceResponseDto } from "../../dtos/provider/providerService/response/provider-service-response.dto";

export class ProviderServiceMapper {
  static toResponse(
    providerService: ProviderService,
  ): ProviderServiceResponseDto {
    if (!providerService.id) {
      throw new EntityNotPersistedError("Provider Servive");
    }

    return {
      id: providerService.id,
      providerId: providerService.providerId,
      serviceId: providerService.serviceId,
      price: providerService.price,
      status: providerService.status,
      isActive: providerService.isActive,
      createdAt: providerService.createdAt,
      updatedAt: providerService.updatedAt,
    };
  }
}