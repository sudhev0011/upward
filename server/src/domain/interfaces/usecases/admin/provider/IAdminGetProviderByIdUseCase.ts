import { ProviderProfileResponseDto } from '../../../../../application/dtos/provider/profile/info/response/provider-profile-response.dto';

export interface IAdminGetProviderByIdUseCase {
  execute(userId: string): Promise<ProviderProfileResponseDto | null>;
}
