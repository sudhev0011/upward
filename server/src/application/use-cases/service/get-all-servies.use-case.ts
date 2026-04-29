import { Service } from "../../../domain/entities/service.entity";
import { NotFoundError } from "../../../domain/errors/errors";
import { IServiceRepository } from "../../../domain/interfaces/repositories/service/IServiceRepository";
import { IGetAllServicesUseCase } from "../../../domain/interfaces/usecases/service/IGetAllServicesUseCase";
import { ServiceResponseDto } from "../../dtos/admin/service/response/service-response.dto";
import { ServiceMapper } from "../../mapers/service/service-mapper";

export class GetAllServicesUseCase implements IGetAllServicesUseCase {
  constructor(private readonly _serviceRepository: IServiceRepository) {}
  async execute(isAdmin: boolean): Promise<ServiceResponseDto[]> {
    let services;
    
    if (isAdmin) {
      services = await this._serviceRepository.findAll();
    } else {
      services = await this._serviceRepository.findAllActive();
    }

    if (!services) {
      throw new NotFoundError("services not found");
    }

    const result = services.map((service: Service) => {
      return ServiceMapper.toResponse(service);
    });

    return result;
  }
}
