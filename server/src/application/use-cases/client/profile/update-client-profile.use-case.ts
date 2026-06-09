import { IClientProfileRepository } from '../../../../domain/interfaces/repositories/client/IClientProfileRepository';
import { IUpdateClientProfileUseCase } from '../../../../domain/interfaces/usecases/client/profile/IUpdateClientProfileUseCase';
import { NotFoundError } from '../../../../domain/errors/errors';
import { ClientProfileMapper } from '../../../mapers/client/client-profile.mappers';
import { ClientProfileResponseDto } from '../../../dtos/client/profile/info/response/client-profile-response.dto';
import { IUserRepository } from '../../../../domain/interfaces/repositories/user/IUserRepository';
import { UpdateClientProfileRequestDto } from '../../../dtos/client/profile/info/request/update-client-profile-request.dto';
import { IS3Service } from '../../../../domain/interfaces/services/IS3Service';
import { ILogger } from '../../../../domain/interfaces/services/ILogger';

export class UpdateClientProfileUseCase implements IUpdateClientProfileUseCase {
  constructor(
    private readonly _clientProfileRepository: IClientProfileRepository,
    private readonly _userRepository: IUserRepository,
    private readonly _s3Service: IS3Service,
    private readonly _logger: ILogger,
  ) {}

  async execute(dto: UpdateClientProfileRequestDto): Promise<ClientProfileResponseDto> {
    const { userId } = dto;
    const existingProfile = await this._clientProfileRepository.findOne({ userId });
    
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
        this._logger.error("Failed to delete old profile picture:", err);
      });
    }

    const updateData = ClientProfileMapper.toUpdateEntity(dto);

    const updatedProfile = await this._clientProfileRepository.update(existingProfile.id, updateData);
    
    if (!updatedProfile) {
      throw new NotFoundError('Failed to update seeker profile');
    }

    if(!user.avatarFileName){
      await this._userRepository.update(userId, {avatarFileName: updatedProfile.avatarUrl})
    }
    

    const profileDto = ClientProfileMapper.toResponse(updatedProfile);
    
    return {
      ...profileDto,
      name: user.name || '', 
      email: user.email || '', 
    };
    
  }
}



