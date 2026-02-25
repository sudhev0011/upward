import { RequestOtpRequestDto } from '../../../../../application/dtos/auth/verification/request-otp.use-case.dto';

export interface IRequestOtpUseCase {
    execute(params: RequestOtpRequestDto): Promise<void>;
}