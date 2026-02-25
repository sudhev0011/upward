import { GoogleLoginRequestDto } from "../../../../../application/dtos/auth/session/google-login-request.dto";
import { LoginResponseDto } from "../../../../../application/dtos/auth/session/login-response.dto";

export interface IGoogleLoginUseCase {

    execute(params: GoogleLoginRequestDto): Promise<LoginResponseDto>;
}