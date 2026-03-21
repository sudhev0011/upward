import { CreateProviderProfileRequestDto } from "../../../../../application/dtos/provider/profile/info/request/create-provider-profile-request.dto";
import { ProviderProfileResponseDto } from "../../../../../application/dtos/provider/profile/info/response/provider-profile-response.dto";
export interface ICreateProviderProfileUseCase{

    execute(dto: CreateProviderProfileRequestDto): Promise<ProviderProfileResponseDto>
}