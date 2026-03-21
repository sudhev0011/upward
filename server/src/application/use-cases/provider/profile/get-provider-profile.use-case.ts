import { IProviderProfileRepository } from '../../../../domain/interfaces/repositories/provider/IProviderProfileRepository';
import { IUserRepository } from '../../../../domain/interfaces/repositories/user/IUserRepository';
import { IGetProviderProfileUseCase } from '../../../../domain/interfaces/usecases/provider/profile/IGetProviderProfileUseCase';
import { NotFoundError } from '../../../../domain/errors/errors';
import { ProviderProfileMapper } from '../../../mapers/provider/provider-profile.mappers';
import { ProviderProfileResponseDto } from '../../../dtos/provider/profile/info/response/provider-profile-response.dto';

export class GetProviderProfileUseCase implements IGetProviderProfileUseCase {
  constructor(
    private readonly _providerProfileRepository: IProviderProfileRepository,
    private readonly _userRepository: IUserRepository,
  ) {}

  async execute(userId: string): Promise<ProviderProfileResponseDto> {
    
    const user = await this._userRepository.findById(userId);
    
    if (!user) {
      throw new NotFoundError('User not found');
    }

    let profile = await this._providerProfileRepository.findOne({ userId });

    if (!profile) {
      profile = await this._providerProfileRepository.create(
        ProviderProfileMapper.toEntity({ userId }),
      );
    }

    const profileDto = ProviderProfileMapper.toResponse(profile);
    
    return {
      ...profileDto,
      name: user.name || '', 
      email: user.email || '', 
    };
  }
}



