import { ClientProfileResponseDto } from '../../../../../application/dtos/client/profile/info/response/client-profile-response.dto';
import { UpdateClientProfileRequestDto } from '../../../../../application/dtos/client/profile/info/request/update-client-profile-request.dto';

export interface IUpdateClientProfileUseCase {
  execute(dto: UpdateClientProfileRequestDto): Promise<ClientProfileResponseDto>;
}
