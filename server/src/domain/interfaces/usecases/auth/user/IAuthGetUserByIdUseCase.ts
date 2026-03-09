import { UserResponseDto } from '../../../../../application/dtos/auth/user/user.response.dto';
export interface IAuthGetUserByIdUseCase {
  execute(userId: string): Promise<UserResponseDto | null>;
}
