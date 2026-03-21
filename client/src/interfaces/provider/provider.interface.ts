
export interface SocialLink {
  name: string;
  link: string;
}

export interface ProviderProfile {
  id: string;
  userId: string;
  name: string;
  bio: string | null;
  location: string | null;
  phone: string | null;
  email: string;
  avatarUrl: string | null;
  dateOfBirth: string | null;
  gender: string | null;
  skills: string[];
  languages: string[];
  experience: string | null;
  socialLinks: SocialLink[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateProviderProfileRequest {
  bio?: string;
  location?: string;
  phone?: string;
  email: string;
  dateOfBirth?: string;
  gender?: string;
  skills?: string[];
  socialLinks?: SocialLink[];
}

export interface UpdateProviderProfileRequest {
  bio?: string;
  location?: string;
  phone?: string;
  email?: string;
  name?: string;
  dateOfBirth?: string;
  gender?: string;
  skills?: string[];
  languages?: string[];
  socialLinks?: SocialLink[];
}





