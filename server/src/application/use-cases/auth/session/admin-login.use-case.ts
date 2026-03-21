import { UserRole } from '../../../../domain/enums/user-role.enum';
import { ITokenService } from '../../../../domain/interfaces/services/ITokenService';
import { IPasswordHasher } from '../../../../domain/interfaces/services/IPasswordHasher';
import { IUserRepository } from '../../../../domain/interfaces/repositories/user/IUserRepository';
import { IAdminLoginUseCase } from '../../../../domain/interfaces/usecases/auth/session/IAdminLoginUseCase';
import { AuthenticationError, AuthorizationError } from '../../../../domain/errors/errors';
import { UserMapper } from '../../../mapers/auth/user.mapper';
import { LoginRequestDto } from '../../../dtos/auth/session/login.dto';
import { LoginResponseDto } from '../../../dtos/auth/session/login-response.dto';

export class AdminLoginUseCase implements IAdminLoginUseCase {
  constructor(
    private readonly _userRepository: IUserRepository,
    private readonly _passwordHasher: IPasswordHasher,
    private readonly _tokenService: ITokenService,
  ) { }

  async execute(params: LoginRequestDto): Promise<LoginResponseDto> {
    const { email, password } = params;
    const user = await this._userRepository.findOne({ email });
    if (!user) {
      throw new AuthenticationError('Invalid credentials');
    }

    if (user.isBlocked) {
      throw new AuthorizationError('User is blocked');
    }

    if (!user.roles.includes(UserRole.ADMIN)) {
      throw new AuthorizationError('Not authorized as admin');
    }

    const isPasswordValid = await this._passwordHasher.compare(password, user.password);
    if (!isPasswordValid) {
      throw new AuthenticationError('Invalid credentials');
    }

    const accessToken = this._tokenService.signAccess({ sub: user.id, roles: user.roles, email: user.email });
    const refreshToken = this._tokenService.signRefresh({ sub: user.id, email: user.email });
    const hashedRefresh = await this._passwordHasher.hash(refreshToken);
    await this._userRepository.update(user.id, { refreshToken: hashedRefresh });

    return {
      tokens: { accessToken, refreshToken },
      user: UserMapper.toResponse(user),
    };
  }
}

