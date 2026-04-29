import { ToggleServiceRequestDto } from "../../../../application/dtos/admin/service/request/toggle-service-request.dto";
import { ServiceResponseDto } from "../../../../application/dtos/admin/service/response/service-response.dto";

export interface IToggleServiceUseCase{
    execute(data: ToggleServiceRequestDto):Promise<ServiceResponseDto>
}