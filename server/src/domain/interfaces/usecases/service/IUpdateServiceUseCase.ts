import { UpdateServiceRequestDto } from "../../../../application/dtos/admin/service/request/update-service-request.dto";
import { ServiceResponseDto } from "../../../../application/dtos/admin/service/response/service-response.dto";

export interface IUpdateServiceUseCase {

    execute(dto: UpdateServiceRequestDto): Promise<ServiceResponseDto>
}