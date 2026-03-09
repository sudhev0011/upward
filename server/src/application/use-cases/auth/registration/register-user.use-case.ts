import { ValidationError } from '../../../../domain/errors/errors';
import { IOtpService } from '../../../../domain/interfaces/services/IOtpService';
import { IMailerService } from '../../../../domain/interfaces/services/IEmailServices';
import { IEmailTemplateService } from '../../../../domain/interfaces/services/IEmailTemplateService';
import { IPasswordHasher } from '../../../../domain/interfaces/services/IPasswordHasher';
import { IUserRepository } from '../../../../domain/interfaces/repositories/user/IUserRepository';
import { IRegisterUserUseCase } from '../../../../domain/interfaces/usecases/auth/registration/IRegisterUserUseCase';
import { UserMapper } from '../../../mapers/auth/user.mapper';
import { RegisterRequestDto } from '../../../dtos/auth/registration/register.request.dto';
import { RegisterResponseDto } from '../../../dtos/auth/registration/register.response.dto';

export class RegisterUserUseCase implements IRegisterUserUseCase {
  constructor(
    private readonly _userRepository: IUserRepository,
    private readonly _passwordHasher: IPasswordHasher,
    private readonly _otpService: IOtpService,
    private readonly _mailerService: IMailerService,
    private readonly _emailTemplateService: IEmailTemplateService,
  ) { }

  async execute(params: RegisterRequestDto): Promise<RegisterResponseDto> {
    const { email, password } = params;

    const existingUser = await this._userRepository.findOne({ email });
    if (existingUser) {
      throw new ValidationError('Email already registered');
    }

    const hashedPassword = await this._passwordHasher.hash(password);

    const user = await this._userRepository.create(
      UserMapper.fromRegistration(params, hashedPassword),
    );

    await this.sendOtpEmail(user.email);
    return { user: UserMapper.toResponse(user) };
  }

  private async sendOtpEmail(email: string): Promise<void> {
    const code = await this._otpService.generateAndStoreOtp(email);
    const { subject, html } = this._emailTemplateService.getOtpVerificationEmail(code);
    await this._mailerService.sendMail(email, subject, html);
  }
}

