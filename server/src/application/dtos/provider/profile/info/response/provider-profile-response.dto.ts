import { Location } from "../../../../../../domain/interfaces/provider-profile.interface";

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
  createdAt: string;
  updatedAt: string;
}