import { CreateServiceRequestDto } from "../../../../application/dtos/admin/service/request/create-service-request.dto";
import { ServiceResponseDto } from "../../../../application/dtos/admin/service/response/service-response.dto";

export interface ICreateServiceUseCase {
  execute(data: CreateServiceRequestDto): Promise<ServiceResponseDto>;
}
