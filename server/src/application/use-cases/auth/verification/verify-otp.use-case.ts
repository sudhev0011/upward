import { UserRole } from '../../../../domain/enums/user-role.enum';
import { IOtpService } from '../../../../domain/interfaces/services/IOtpService';
import { ITokenService } from '../../../../domain/interfaces/services/ITokenService';
import { IPasswordHasher } from '../../../../domain/interfaces/services/IPasswordHasher';
import { IUserRepository } from '../../../../domain/interfaces/repositories/user/IUserRepository';
import { IVerifyOtpUseCase } from '../../../../domain/interfaces/usecases/auth/verification/IVerifyOtpUseCase';
import { ValidationError } from '../../../../domain/errors/errors';
import { VerifyOtpRequestDto } from '../../../dtos/auth/verification/verify-otp-use-case.dto';
import { LoginResponseDto } from '../../../dtos/auth/session/login-response.dto';
import { UserMapper } from '../../../mapers/auth/user.mapper';

export class VerifyOtpUseCase implements IVerifyOtpUseCase {
  constructor(
    private readonly _otpService: IOtpService,
    private readonly _tokenService: ITokenService,
    private readonly _passwordHasher: IPasswordHasher,
    private readonly _userRepository: IUserRepository,
  ) { }

  async execute(params: VerifyOtpRequestDto): Promise<LoginResponseDto> {
    const { email, code } = params;

    const isValid = await this._otpService.verifyOtp(email, code);
    if (!isValid) {
      throw new ValidationError('Invalid or expired OTP');
    }

    const user = await this._userRepository.findOne({ email });
    if (!user) {
      throw new ValidationError('User not found');
    }

    await this._userRepository.update(user.id, { isVerified: true });

    const accessToken = this._tokenService.signAccess({
      sub: user.id,
      role: user.role as UserRole,
      email: user.email
    });
    const refreshToken = this._tokenService.signRefresh({ sub: user.id, email: user.email });
    const hashedRefresh = await this._passwordHasher.hash(refreshToken);

    await this._userRepository.update(user.id, { refreshToken: hashedRefresh });

    return {
      tokens: { accessToken, refreshToken },
      user: UserMapper.toResponse(user),
    };
  }
}