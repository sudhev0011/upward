import { setProviderServicePriceRequestDto } from "../../../../../application/dtos/provider/providerService/request/set-provider-service-price-request.dto";
import { ProviderServiceResponseDto } from "../../../../../application/dtos/provider/providerService/response/provider-service-response.dto";

export interface IConfigureProviderServiceUseCase {
  execute(
    data: setProviderServicePriceRequestDto,
  ): Promise<ProviderServiceResponseDto>;
}
