import { IProviderProfileRepository } from '../../../../domain/interfaces/repositories/provider/IProviderProfileRepository';
import { IUpdateProviderProfileUseCase } from '../../../../domain/interfaces/usecases/provider/profile/IUpdateProviderProfileUseCase';
import { NotFoundError } from '../../../../domain/errors/errors';
import { ProviderProfileMapper } from '../../../mapers/provider/provider-profile.mappers';
import { ProviderProfileResponseDto } from '../../../dtos/provider/profile/info/response/provider-profile-response.dto';
import { IUserRepository } from '../../../../domain/interfaces/repositories/user/IUserRepository';
import { UpdateProviderProfileRequestDto } from '../../../dtos/provider/profile/info/request/update-provider-profile-request.dto';
import { IS3Service } from '../../../../domain/interfaces/services/IS3Service';
import { ILogger } from '../../../../domain/interfaces/services/ILogger';

export class UpdateProviderProfileUseCase implements IUpdateProviderProfileUseCase {
  constructor(
    private readonly _providerProfileRepository: IProviderProfileRepository,
    private readonly _userRepository: IUserRepository,
    private readonly _s3Service: IS3Service,
    private readonly _logger: ILogger,
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

    if (
      dto.avatarUrl !== undefined && 
      existingProfile.avatarUrl && 
      dto.avatarUrl !== existingProfile.avatarUrl
    ) {
      await this._s3Service.deleteFile(existingProfile.avatarUrl).catch((err) => {
        this._logger.error("Failed to delete old provider avatar:", err);
      });
    }

    const updateData = ProviderProfileMapper.toUpdateEntity(dto);

    const updatedProfile = await this._providerProfileRepository.update(existingProfile.id, updateData);
    
    if (!updatedProfile) {
      throw new NotFoundError('Failed to update seeker profile');
    }

    if(!user.avatarFileName){
      await this._userRepository.update(userId, {avatarFileName: updatedProfile.avatarUrl})
    }
    

    return ProviderProfileMapper.toResponse(updatedProfile,user);
  }
}



