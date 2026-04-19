import { ProviderProfileResponseDto } from '../../../provider/profile/info/response/provider-profile-response.dto';

export interface ProviderDetailsResultDto extends ProviderProfileResponseDto {
  name: string;
  email: string;
  isBlocked: boolean;
  isVerified: boolean; 
}
