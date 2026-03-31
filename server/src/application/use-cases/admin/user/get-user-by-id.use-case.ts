import { IUserRepository } from '../../../../domain/interfaces/repositories/user/IUserRepository';
import { IAdminGetUserByIdUseCase } from '../../../../domain/interfaces/usecases/admin/user/IAdminGetUserByIdUseCase';
import { IGetClientProfileUseCase } from '../../../../domain/interfaces/usecases/client/profile/IGetClientProfileUseCase';
import { NotFoundError } from '../../../../domain/errors/errors';
import { UserResponseDto } from '../../../dtos/auth/user/user.response.dto';
import { UserMapper } from '../../../mapers/auth/user.mapper';
import { UserRole } from '../../../../domain/enums/user-role.enum';

export class AdminGetUserByIdUseCase implements IAdminGetUserByIdUseCase {
  constructor(
    private readonly _userRepository: IUserRepository,
    private readonly _getClientProfileUseCase: IGetClientProfileUseCase,
  ) { }

  async execute(userId: string): Promise<UserResponseDto> {
    const user = await this._userRepository.findById(userId);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    const response = UserMapper.toResponse(user);

    if (user.roles.includes(UserRole.CLIENT)) {
      try {
        const profile = await this._getClientProfileUseCase.execute(userId);
        response.clientProfile = profile;
        response.avatar = profile.profilePicture || undefined;
      } catch (error) {
        // If profile fetch fails, we still return the user info
        console.error('Error fetching seeker profile in GetUserByIdUseCase:', error);
      }
    }

    return response;
  }
}