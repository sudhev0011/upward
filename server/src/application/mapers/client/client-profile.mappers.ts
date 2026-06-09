import { ClientProfile } from '../../../domain/entities/client-profile.entity';
import { ClientProfileResponseDto } from '../../dtos/client/profile/info/response/client-profile-response.dto';
import { CreateInput } from '../../../domain/types/common.types';
import { User } from '../../../domain/entities/user.entity';

export class ClientProfileMapper {
  static toEntity(data: {
    userId: string;
    location?: string | null;
    phone?: string | null;
    avatarUrl?: string | null;
  }): CreateInput<ClientProfile> {
    return {
      userId: data.userId,
      location: data.location ?? null,
      phone: data.phone ?? null,
      avatarUrl: data.avatarUrl ?? null,
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
      avatarUrl: profile.avatarUrl,
      isBlocked: user?.isBlocked ?? null,
      isVerified: user?.isVerified ?? null,
      createdAt: profile.createdAt.toISOString(),
      updatedAt: profile.updatedAt.toISOString(),
    };
  }

  static toUpdateEntity(dto: Partial<{
    location: string | null;
    phone: string | null;
    avatarUrl: string | null;
  }>): Partial<ClientProfile> {
    const updateData: Record<string, unknown> = {};
    if (dto.location !== undefined) updateData.location = dto.location;
    if (dto.phone !== undefined) updateData.phone = dto.phone;
    if (dto.avatarUrl !== undefined) updateData.avatarUrl = dto.avatarUrl;
    return updateData;
  }

}

