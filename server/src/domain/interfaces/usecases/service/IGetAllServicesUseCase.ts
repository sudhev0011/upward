import { ServiceResponseDto } from "../../../../application/dtos/admin/service/response/service-response.dto";

export interface IGetAllServicesUseCase{
    execute(isAdmin: boolean): Promise<ServiceResponseDto[]>
}