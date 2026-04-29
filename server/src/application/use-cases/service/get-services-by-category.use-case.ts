import { Service } from "../../../domain/entities/service.entity";
import { NotFoundError } from "../../../domain/errors/errors";
import { IServiceRepository } from "../../../domain/interfaces/repositories/service/IServiceRepository";
import { IGetServicesByCategoryUseCase } from "../../../domain/interfaces/usecases/service/IGetServicesByCategoryUseCase";
import { ServiceResponseDto } from "../../dtos/admin/service/response/service-response.dto";
import { ServiceMapper } from "../../mapers/service/service-mapper";

export class GetServicesByCategoryUseCase implements IGetServicesByCategoryUseCase {
  constructor(private readonly _serviceRepository: IServiceRepository) {}
  async execute(categoryId: string): Promise<ServiceResponseDto[]> {
    
    const services = await this._serviceRepository.findByCategory(categoryId);

    if (!services) {
      throw new NotFoundError("services not found");
    }

    const result = services.map((service: Service) => {
      return ServiceMapper.toResponse(service);
    });

    return result;
  }
}
