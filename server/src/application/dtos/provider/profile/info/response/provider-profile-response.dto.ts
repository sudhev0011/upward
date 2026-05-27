import { Location } from "../../../../common/location/location.dto";

export interface SocialLinkResponseDto {
  name: string;
  link: string;
}

export interface ProviderProfileResponseDto {
  id: string;
  userId: string;
  name: string | null;
  bio: string | null;
  location: Location | null;
  phone: string | null;
  email: string | null;
  avatarUrl: string | null; 
  dateOfBirth: string | null;
  gender: string | null;
  skills: string[];
  languages: string[];
  experience: string | null;
  ratingCount: number | null;
  ratingAvg: number | null;
  isApprovedByAdmin: boolean | null;
  isBlocked: boolean | null;
  isVerified: boolean |  null;
  socialLinks: SocialLinkResponseDto[];
  activeSubscriptionExpiresAt: string | null;
  activeSubscriptionPlanName: string | null;
  createdAt: string;
  updatedAt: string;
}