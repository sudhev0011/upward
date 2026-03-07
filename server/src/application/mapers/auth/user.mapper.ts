import { UserResponseDto } from '../../dtos/auth/user/user.response.dto';
import { User } from '../../../domain/entities/user.entity';
import { UserRole } from '../../../domain/enums/user-role.enum';
import { CreateInput } from '../../../domain/types/common.types';
import { RegisterRequestDto } from '../../dtos/auth/registration/register.request.dto';
import { IGoogleProfile } from '../../../domain/interfaces/services/IGoogleTokenVerifier';
export class UserMapper {
  static toResponse(user: User): UserResponseDto {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatarFileName ? user.avatarFileName : '',
      isVerified: user.isVerified,
      isBlocked: user.isBlocked,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  static fromGoogleProfile(
    profile: IGoogleProfile,
    hashedPassword: string,
  ): CreateInput<User> {
    return {
      name: profile.name || '',
      email: profile.email,
      password: hashedPassword,
      role: UserRole.CLIENT,
      avatarFileName: profile.picture || null,
      isVerified: profile.emailVerified,
      isBlocked: false,
      refreshToken: null,
    };
  }

  static fromRegistration(
    data: RegisterRequestDto,
    hashedPassword: string,
  ): CreateInput<User> {
    return {
      name: data.name,
      email: data.email,
      password: hashedPassword,
      role: data.role || UserRole.CLIENT,
      avatarFileName: null,
      isVerified: false,
      isBlocked: false,
      refreshToken: null,
    };
  }
}
