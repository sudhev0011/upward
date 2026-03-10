import { CreateClientProfileRequestDto } from "../../../../../application/dtos/client/profile/info/request/create-client-profile-request.dto";
import { ClientProfileResponseDto } from "../../../../../application/dtos/client/profile/info/response/client-profile-response.dto";

export interface ICreateClientProfileUseCase{

    execute(dto: CreateClientProfileRequestDto): Promise<ClientProfileResponseDto>
}