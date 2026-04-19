import { SocialLinkResponseDto } from "../../../application/dtos/provider/profile/info/response/provider-profile-response.dto";

export type ProviderListItem = {
  id: string;
  userId: string;
  name: string;
  email: string;
  isBlocked: boolean;
  isVerified: boolean;
  bio: string | null;
  location: string | null;
  phone: string | null;
  avatarUrl: string | null;
  dateOfBirth: string | null;
  gender: string | null;
  skills: string[];
  languages: string[];
  experience: string | null;
  ratingCount: number | null;
  ratingAvg: number | null;
  isApprovedByAdmin: boolean | null;
  socialLinks: SocialLinkResponseDto[];
  createdAt: string;
  updatedAt: string;
};
