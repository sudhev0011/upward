import { ValidationError } from "../../../domain/errors/errors";
import { IServiceRepository } from "../../../domain/interfaces/repositories/service/IServiceRepository";
import { IUpdateServiceUseCase } from "../../../domain/interfaces/usecases/service/IUpdateServiceUseCase";
import { UpdateServiceRequestDto } from "../../dtos/admin/service/request/update-service-request.dto";
import { ServiceResponseDto } from "../../dtos/admin/service/response/service-response.dto";
import { ServiceMapper } from "../../mapers/service/service-mapper";

export class UpdateServiceUseCase implements IUpdateServiceUseCase{

    constructor(
        private readonly _serviceRepository : IServiceRepository
    ){}

    async execute(dto: UpdateServiceRequestDto): Promise<ServiceResponseDto> {
        
        const result = await this._serviceRepository.update(dto.id, {
            categoryId: dto.categoryId,
            name: dto.name,
            description: dto.description,
            maxHour: dto.maxHour,
            mode: dto.mode,
            isActive: dto.isActive
        });

        if(!result){
            throw new ValidationError("service id is invalid");
        }

        return ServiceMapper.toResponse(result)
    }
}