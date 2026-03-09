import { IOtpService } from '../../../../domain/interfaces/services/IOtpService';
import { IMailerService } from '../../../../domain/interfaces/services/IEmailServices';
import { IRequestOtpUseCase } from '../../../../domain/interfaces/usecases/auth/verification/IRequestOtpUseCase';
import { ValidationError } from '../../../../domain/errors/errors';
import { otpVerificationTemplate } from '../../../../infrastructure/mailing/templates/otp-verification.template';
import { RequestOtpRequestDto } from '../../../dtos/auth/verification/request-otp.use-case.dto';
import { IUserRepository } from '../../../../domain/interfaces/repositories/user/IUserRepository';

export class RequestOtpUseCase implements IRequestOtpUseCase {
  constructor(
        private readonly _otpService: IOtpService,
        private readonly _mailerService: IMailerService,
        private readonly _userRepository: IUserRepository,
  ) { }

  async execute(params: RequestOtpRequestDto): Promise<void> {
    const { email } = params;

    const user = await this._userRepository.findOne({ email });
    if (!user) {
      throw new ValidationError('User not found');
    }

    if (user.isVerified) {
      throw new ValidationError('User already verified');
    }

    const code = await this._otpService.generateAndStoreOtp(email);
    await this._mailerService.sendMail(
      email,
      otpVerificationTemplate.subject,
      otpVerificationTemplate.html(code),
    );
  }
}