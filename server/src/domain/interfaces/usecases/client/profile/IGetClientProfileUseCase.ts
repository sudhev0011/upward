import { ClientProfileResponseDto } from '../../../../../application/dtos/client/profile/info/response/client-profile-response.dto';

export interface IGetClientProfileUseCase {
  execute(userId: string): Promise<ClientProfileResponseDto>;
}
