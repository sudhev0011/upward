import { NotFoundError } from "../../../domain/errors/errors";
import { IServiceRepository } from "../../../domain/interfaces/repositories/service/IServiceRepository";
import { IToggleServiceUseCase } from "../../../domain/interfaces/usecases/service/IToggleServiceUseCase";
import { ToggleServiceRequestDto } from "../../dtos/admin/service/request/toggle-service-request.dto";
import { ServiceResponseDto } from "../../dtos/admin/service/response/service-response.dto";
import { ServiceMapper } from "../../mapers/service/service-mapper";

export class ToggleServiceUseCase implements IToggleServiceUseCase{

    constructor(
        private readonly _serviceRepository: IServiceRepository,
    ){}

    async execute(data: ToggleServiceRequestDto): Promise<ServiceResponseDto> {
        
        const result = await this._serviceRepository.update(data.serviceId, {isActive:data.isActive});

        if(!result){
            throw new NotFoundError();
        }

        return ServiceMapper.toResponse(result);
    }
}