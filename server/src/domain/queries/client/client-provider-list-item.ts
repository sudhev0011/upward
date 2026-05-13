export interface ClientProviderListItem {
  id: string;
  userId: string;
  name: string;
  email: string;
  bio: string | null;
  location: string | null;
  avatarUrl: string | null;
  experience: string | null;
  ratingAvg: number;
  ratingCount: number;
  categories: string[];
  skills: string[];
  socialLinks: { name: string; link: string }[];  
}