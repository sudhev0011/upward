import { ClientProfile } from '../../../domain/entities/client-profile.entity';
import { ClientProfileResponseDto } from '../../dtos/client/profile/info/response/client-profile-response.dto';
import { CreateInput } from '../../../domain/types/common.types';

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
  ): ClientProfileResponseDto {
    return {
      id: profile.id,
      userId: profile.userId,
      location: profile.location,
      email: null,
      name: null,
      phone: profile.phone,
      profilePicture: null,
      createdAt: profile.createdAt.toISOString(),
      updatedAt: profile.updatedAt.toISOString(),
    };
  }

  static toUpdateEntity(dto: Partial<{
    location: string | null;
    phone: string | null;
  }>): Partial<ClientProfile> {
    const updateData: Record<string, unknown> = {};
    if (dto.location !== undefined) updateData.location = dto.location;
    if (dto.phone !== undefined) updateData.phone = dto.phone;
    return updateData;
  }

}

