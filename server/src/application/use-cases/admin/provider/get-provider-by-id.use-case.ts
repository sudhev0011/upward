import { IProviderProfileRepository } from '../../../../domain/interfaces/repositories/provider/IProviderProfileRepository';
import { IUserRepository } from '../../../../domain/interfaces/repositories/user/IUserRepository';
import { IAdminGetProviderByIdUseCase } from '../../../../domain/interfaces/usecases/admin/provider/IAdminGetProviderByIdUseCase';
import { NotFoundError } from '../../../../domain/errors/errors';
import { ProviderProfileMapper } from '../../../mapers/provider/provider-profile.mappers';
import { ProviderProfileResponseDto } from '../../../dtos/provider/profile/info/response/provider-profile-response.dto';
export class AdminGetProviderByIdUseCase implements IAdminGetProviderByIdUseCase {
  constructor(
    private readonly _userRepository: IUserRepository,
    private readonly _providerProfileRepository: IProviderProfileRepository,
  ) {}

  async execute(userId: string): Promise<ProviderProfileResponseDto | null> {
    const user = await this._userRepository.findById(userId);
    
    if (!user) {
      throw new NotFoundError('User not found');
    }

    const profile = await this._providerProfileRepository.findOne({ userId });

    if(!profile){
      throw new NotFoundError("Provider not found")
    }
    return ProviderProfileMapper.toResponse(profile,user)
    
  }
}
