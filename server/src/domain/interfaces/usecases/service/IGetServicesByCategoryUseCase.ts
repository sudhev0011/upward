import { ServiceResponseDto } from "../../../../application/dtos/admin/service/response/service-response.dto";

export interface IGetServicesByCategoryUseCase{
    execute(categoryId: string):Promise<ServiceResponseDto[]>
}