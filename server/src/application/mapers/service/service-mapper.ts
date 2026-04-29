import { Service } from "../../../domain/entities/service.entity";
import { EntityNotPersistedError } from "../../../domain/errors/errors";
import { ServiceResponseDto } from "../../dtos/admin/service/response/service-response.dto";

export class ServiceMapper {
  static toResponse(service: Service): ServiceResponseDto {
    if (!service.id) {
      throw new EntityNotPersistedError("service");
    }
    return {
      id: service.id,
      categoryId: service.categoryId,
      name: service.name,
      description: service.description ?? "",
      mode: service.mode,
      maxHour: service.maxHour,
      isActive: service.isActive,
      createdAt: service.createdAt,
      updatedAt: service.updatedAt,
    };
  }
}
