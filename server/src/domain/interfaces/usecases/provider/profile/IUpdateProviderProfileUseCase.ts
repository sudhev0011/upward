import { UpdateProviderProfileRequestDto } from "../../../../../application/dtos/provider/profile/info/request/update-provider-profile-request.dto";
import { ProviderProfileResponseDto } from "../../../../../application/dtos/provider/profile/info/response/provider-profile-response.dto";

export interface IUpdateProviderProfileUseCase {
  execute(dto: UpdateProviderProfileRequestDto): Promise<ProviderProfileResponseDto>;
}
