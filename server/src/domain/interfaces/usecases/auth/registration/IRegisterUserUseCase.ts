import { RegisterRequestDto } from "../../../../../application/dtos/auth/registration/register.request.dto";
import { RegisterResponseDto } from "../../../../../application/dtos/auth/registration/register.response.dto";

export interface IRegisterUserUseCase {
  execute(params: RegisterRequestDto): Promise<RegisterResponseDto>;
}