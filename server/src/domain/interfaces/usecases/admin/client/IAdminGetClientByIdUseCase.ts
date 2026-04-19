import { ClientProfileResponseDto } from '../../../../../application/dtos/client/profile/info/response/client-profile-response.dto';

export interface IAdminGetClientByIdUseCase {
  execute(userId: string): Promise<ClientProfileResponseDto>;
}