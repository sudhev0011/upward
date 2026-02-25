import { VerifyOtpRequestDto } from '../../../../../application/dtos/auth/verification/verify-otp-use-case.dto';
import { LoginResponseDto } from '../../../../../application/dtos/auth/session/login-response.dto';

export interface IVerifyOtpUseCase {
  execute(params: VerifyOtpRequestDto): Promise<LoginResponseDto>;
}