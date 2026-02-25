import { LoginResponseDto } from "../../../../../application/dtos/auth/session/login-response.dto";
export interface IRefreshTokenUseCase {
  execute(refreshToken: string): Promise<LoginResponseDto>;
}
