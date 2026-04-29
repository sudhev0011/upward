import { CreateProviderServiceRequestDto } from "../../../../../application/dtos/provider/providerService/request/create-provider-service-request.dto";
import { ProviderServiceResponseDto } from "../../../../../application/dtos/provider/providerService/response/provider-service-response.dto";

export interface ICreateProviderServiceUseCase {
  execute(
    data: CreateProviderServiceRequestDto,
  ): Promise<ProviderServiceResponseDto>;
}
