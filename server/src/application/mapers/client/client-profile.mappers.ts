import { ClientProfile } from '../../../domain/entities/client-profile.entity';
import { ClientProfileResponseDto } from '../../dtos/client/profile/info/response/client-profile-response.dto';
import { CreateInput } from '../../../domain/types/common.types';
import { User } from '../../../domain/entities/user.entity';

export class ClientProfileMapper {
  static toEntity(data: {
    userId: string;
    location?: string | null;
    phone?: string | null;
    profilePicture?: string | null;
  }): CreateInput<ClientProfile> {
    return {
      userId: data.userId,
      location: data.location ?? null,
      phone: data.phone ?? null,
      profilePicture: data.profilePicture ?? null,
    };
  }

  static toResponse(
    profile: ClientProfile,
    user?: User 
  ): ClientProfileResponseDto {
    return {
      id: profile.id,
      userId: profile.userId,
      email: user?.email ?? null,
      name: user?.name ?? null,
      location: profile.location,
      phone: profile.phone,
      profilePicture: profile.profilePicture,
      isBlocked: user?.isBlocked ?? null,
      isVerified: user?.isVerified ?? null,
      createdAt: profile.createdAt.toISOString(),
      updatedAt: profile.updatedAt.toISOString(),
    };
  }

  static toUpdateEntity(dto: Partial<{
    location: string | null;
    phone: string | null;
    profilePicture: string | null;
  }>): Partial<ClientProfile> {
    const updateData: Record<string, unknown> = {};
    if (dto.location !== undefined) updateData.location = dto.location;
    if (dto.phone !== undefined) updateData.phone = dto.phone;
    if (dto.profilePicture !== undefined) updateData.profilePicture = dto.profilePicture;
    return updateData;
  }

}

