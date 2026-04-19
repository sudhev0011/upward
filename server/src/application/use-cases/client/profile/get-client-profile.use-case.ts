import { IClientProfileRepository } from '../../../../domain/interfaces/repositories/client/IClientProfileRepository';
import { IUserRepository } from '../../../../domain/interfaces/repositories/user/IUserRepository';
import { IGetClientProfileUseCase } from '../../../../domain/interfaces/usecases/client/profile/IGetClientProfileUseCase';
import { NotFoundError } from '../../../../domain/errors/errors';
import { ClientProfileMapper } from '../../../mapers/client/client-profile.mappers';
import { ClientProfileResponseDto } from '../../../dtos/client/profile/info/response/client-profile-response.dto';

export class GetClientProfileUseCase implements IGetClientProfileUseCase {
  constructor(
    private readonly _clientProfileRepository: IClientProfileRepository,
    private readonly _userRepository: IUserRepository,
  ) {}

  async execute(userId: string): Promise<ClientProfileResponseDto> {
    
    const user = await this._userRepository.findById(userId);
    
    if (!user) {
      throw new NotFoundError('User not found');
    }

    let profile = await this._clientProfileRepository.findOne({ userId });

    if (!profile) {
      profile = await this._clientProfileRepository.create(
        ClientProfileMapper.toEntity({ userId }),
      );
    }

    return ClientProfileMapper.toResponse(profile,user);
  }
}



