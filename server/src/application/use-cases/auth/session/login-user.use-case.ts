import { UserRole } from "../../../../domain/enums/user-role.enum";
import { IOtpService } from "../../../../domain/interfaces/services/IOtpService";
import { ITokenService } from "../../../../domain/interfaces/services/ITokenService";
import { IMailerService } from "../../../../domain/interfaces/services/IEmailServices";
import { IEmailTemplateService } from "../../../../domain/interfaces/services/IEmailTemplateService";
import { IPasswordHasher } from "../../../../domain/interfaces/services/IPasswordHasher";
import {
  AuthenticationError,
  AuthorizationError,
} from "../../../../domain/errors/errors";
import { IUserRepository } from "../../../../domain/interfaces/repositories/user/IUserRepository";
import { ILoginUserUseCase } from "../../../../domain/interfaces/usecases/auth/session/ILoginUserUseCase";
import { UserMapper } from "../../../mapers/auth/user.mapper";
import { LoginRequestDto } from "../../../dtos/auth/session/login.dto";
import { LoginResponseDto } from "../../../dtos/auth/session/login-response.dto";

export class LoginUserUseCase implements ILoginUserUseCase {
  constructor(
    private readonly _userRepository: IUserRepository,
    private readonly _passwordHasher: IPasswordHasher,
    private readonly _tokenService: ITokenService,
    private readonly _otpService: IOtpService,
    private readonly _mailerService: IMailerService,
    private readonly _emailTemplateService: IEmailTemplateService,
  ) {}

  async execute(params: LoginRequestDto): Promise<LoginResponseDto> {
    const { email, password } = params;
    const user = await this._userRepository.findOne({ email });
    if (!user) {
      throw new AuthenticationError("Invalid credentials");
    }

    if (user.isBlocked) {
      throw new AuthorizationError(
        "User is blocked. Contact support for assistance.",
      );
    }

    if (!user.isVerified) {
      const code = await this._otpService.generateAndStoreOtp(user.email);
      const { subject, html } =
        this._emailTemplateService.getOtpVerificationEmail(code);
      await this._mailerService.sendMail(user.email, subject, html);
      return { user: UserMapper.toResponse(user) };
    }

    if (user.roles.includes(UserRole.ADMIN) ) {
      throw new AuthenticationError("Please use admin login endpoint");
    }

    const isPasswordValid = await this._passwordHasher.compare(
      password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new AuthenticationError("Invalid credentials");
    }

    const accessToken = this._tokenService.signAccess({
      sub: user.id,
      roles: user.roles,
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
