import { Location } from "../location.interface";

export interface ClientProviderListItem {
  id: string;
  userId: string;
  name: string;
  email: string;
  bio: string | null;
  location: Location | null;
  avatarUrl: string | null;
  experience: string | null;
  ratingAvg: number;
  ratingCount: number;
  categories: string[];
  skills: string[];
  socialLinks: { name: string; link: string }[];
}

export interface ProviderListingResponse {
  data: ClientProviderListItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface GetProvidersByCategoryParams {
  category: string;
  page?: number;
  limit?: number;
  minRating?: number;
  location?: string;
  sortBy?: 'ratingAvg' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}