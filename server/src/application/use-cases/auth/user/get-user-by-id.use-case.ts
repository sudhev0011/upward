import { IUserRepository } from '../../../../domain/interfaces/repositories/user/IUserRepository';
import { IAuthGetUserByIdUseCase } from '../../../../domain/interfaces/usecases/auth/user/IAuthGetUserByIdUseCase';
import { UserMapper } from '../../../mapers/auth/user.mapper';
import { UserResponseDto } from '../../../dtos/auth/user/user.response.dto';

export class GetUserByIdUseCase implements IAuthGetUserByIdUseCase {
  constructor(private readonly _userRepository: IUserRepository) { }

  async execute(userId: string): Promise<UserResponseDto | null> {
    const user = await this._userRepository.findById(userId);
    return user ? UserMapper.toResponse(user) : null;
  }
}

