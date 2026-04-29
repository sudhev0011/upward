import { Service } from "../../../domain/entities/service.entity";
import { ConflictError } from "../../../domain/errors/errors";
import { IServiceRepository } from "../../../domain/interfaces/repositories/service/IServiceRepository";
import { ICreateServiceUseCase } from "../../../domain/interfaces/usecases/service/ICreateServiceUseCase";
import { CreateServiceRequestDto } from "../../dtos/admin/service/request/create-service-request.dto";
import { ServiceResponseDto } from "../../dtos/admin/service/response/service-response.dto";
import { ServiceMapper } from "../../mapers/service/service-mapper";

export class CreateServiceUseCase implements ICreateServiceUseCase {
  
  constructor(private readonly _serviceRepository: IServiceRepository) {}


  async execute(data: CreateServiceRequestDto): Promise<ServiceResponseDto> {
    const existing = await this._serviceRepository.findOne({ name: data.name });

    if (existing) {
      throw new ConflictError("A service in the same name exists");
    }

    const service = Service.create(data);

    const result = await this._serviceRepository.create(service);

    return ServiceMapper.toResponse(result);
  }
}
