import { IProviderProfileRepository } from '../../../../domain/interfaces/repositories/provider/IProviderProfileRepository';
import { IUpdateProviderProfileUseCase } from '../../../../domain/interfaces/usecases/provider/profile/IUpdateProviderProfileUseCase';
import { NotFoundError } from '../../../../domain/errors/errors';
import { ProviderProfileMapper } from '../../../mapers/provider/provider-profile.mappers';
import { ProviderProfileResponseDto } from '../../../dtos/provider/profile/info/response/provider-profile-response.dto';
import { IUserRepository } from '../../../../domain/interfaces/repositories/user/IUserRepository';

import { UpdateProviderProfileRequestDto } from '../../../dtos/provider/profile/info/request/update-provider-profile-request.dto';

export class UpdateProviderProfileUseCase implements IUpdateProviderProfileUseCase {
  constructor(
    private readonly _providerProfileRepository: IProviderProfileRepository,
    private readonly _userRepository: IUserRepository,
  ) {}

  async execute(dto: UpdateProviderProfileRequestDto): Promise<ProviderProfileResponseDto> {
    const { userId } = dto;
    const existingProfile = await this._providerProfileRepository.findOne({ userId });
    
    if (!existingProfile) {
      throw new NotFoundError('Client profile not found');
    }
    
    const user = await this._userRepository.findById(userId);

    if (!user) {
      throw new NotFoundError('User not found');
    }

    if (dto?.name !== undefined) {
      if (user) {
        await this._userRepository.update(userId, { name: dto.name });
      }
    }
    
    if (dto?.email !== undefined) {
      if (user) {
        await this._userRepository.update(userId, { email: dto.email });
      }
    }

    const updateData = ProviderProfileMapper.toUpdateEntity(dto);

    const updatedProfile = await this._providerProfileRepository.update(existingProfile.id, updateData);
    
    if (!updatedProfile) {
      throw new NotFoundError('Failed to update seeker profile');
    }
    

    const profileDto = ProviderProfileMapper.toResponse(updatedProfile);
    
    return {
      ...profileDto,
      name: user.name || '', 
      email: user.email || '', 
    };
    
  }
}



