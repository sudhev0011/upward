import { ProviderProfile } from "../../../domain/entities/provider-profile.entity";
import { SocialLink } from "../../../domain/entities/provider-profile.entity";
import {
  ProviderProfileResponseDto,
  SocialLinkResponseDto,
} from "../../dtos/provider/profile/info/response/provider-profile-response.dto";
import { CreateInput } from "../../../domain/types/common.types";
import { User } from "../../../domain/entities/user.entity";

export class ProviderProfileMapper {
  static toEntity(data: {
    userId: string;
    bio?: string | null;
    location?: string | null;
    phone?: string | null;
    avatarUrl?: string | null;
    dateOfBirth?: Date | null;
    gender?: string | null;
    skills?: string[];
    languages?: string[];
    experince?: string | null;
    ratingCount?: number | null;
    ratingAvg?: number | null;
    isApprovedByAdmin?: boolean | null;
    socialLinks?: SocialLink[];
  }): CreateInput<ProviderProfile> {
    return {
      userId: data.userId,
      bio: data.bio ?? null,
      location: data.location ?? null,
      phone: data.phone ?? null,
      avatarUrl: data.avatarUrl ?? null,
      dateOfBirth: data.dateOfBirth ?? null,
      gender: data.gender ?? null,
      skills: data.skills ?? [],
      languages: data.languages ?? [],
      experience: data.experince ?? null,
      ratingCount: data.ratingCount ?? 0,
      ratingAvg: data.ratingAvg ?? 0,
      isApprovedByAdmin: data.isApprovedByAdmin ?? false,
      socialLinks: data.socialLinks ?? [],
    };
  }

  static toResponse(
    profile: ProviderProfile,
    user?: User,
  ): ProviderProfileResponseDto {
    return {
      id: profile.id,
      userId: profile.userId,
      name: user?.name ?? null,
      email: user?.email ?? null,
      bio: profile.bio,
      location: profile.location,
      phone: profile.phone,
      avatarUrl: profile.avatarUrl || null,
      dateOfBirth: profile.dateOfBirth
        ? profile.dateOfBirth.toISOString()
        : null,
      gender: profile.gender,
      skills: profile.skills,
      languages: profile.languages,
      socialLinks: profile.socialLinks.map((link: SocialLink) =>
        this.socialLinkToResponse(link),
      ),
      experience: profile.experience,
      ratingCount: profile.ratingCount,
      ratingAvg: profile.ratingAvg,
      isApprovedByAdmin: profile.isApprovedByAdmin,
      isBlocked: user?.isBlocked ?? null,
      isVerified: user?.isVerified ?? null,
      createdAt: profile.createdAt.toISOString(),
      updatedAt: profile.updatedAt.toISOString(),
    };
  }

  static socialLinkToResponse(link: SocialLink): SocialLinkResponseDto {
    return {
      name: link.name,
      link: link.link,
    };
  }

  static toUpdateEntity(
    dto: Partial<{
      bio: string | null;
      location: string | null;
      phone: string | null;
      email: string | null;
      dateOfBirth: string | null;
      gender: string | null;
      skills: string[];
      languages: string[];
      experience: string | null;
      ratingCount: number | null;
      ratingAvg: number | null;
      isApprovedByAdmin: boolean | null;
      socialLinks: SocialLink[];
      avatarUrl: string | null;
    }>,
  ): Partial<ProviderProfile> {
    const updateData: Record<string, unknown> = {};
    if (dto.bio !== undefined) updateData.bio = dto.bio;
    if (dto.location !== undefined) updateData.location = dto.location;
    if (dto.phone !== undefined) updateData.phone = dto.phone;
    if (dto.email !== undefined) updateData.email = dto.email;
    if (dto.dateOfBirth !== undefined)
      updateData.dateOfBirth = dto.dateOfBirth
        ? new Date(dto.dateOfBirth)
        : null;
    if (dto.gender !== undefined) updateData.gender = dto.gender;
    if (dto.skills !== undefined) updateData.skills = dto.skills;
    if (dto.languages !== undefined) updateData.languages = dto.languages;
    if (dto.experience !== undefined) updateData.experience = dto.experience;
    if (dto.ratingCount !== undefined) updateData.ratingCount = dto.ratingCount;
    if (dto.ratingAvg !== undefined) updateData.ratingAvg = dto.ratingAvg;
    if (dto.isApprovedByAdmin !== undefined)
      updateData.isApprovedByAdmin = dto.isApprovedByAdmin;
    if (dto.socialLinks !== undefined) updateData.socialLinks = dto.socialLinks;
    if (dto.avatarUrl !== undefined) updateData.avatarUrl = dto.avatarUrl;
    return updateData;
  }
}
