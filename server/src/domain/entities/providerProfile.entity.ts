import { Experience, Education, ResumeMeta, SocialLink } from '../interfaces/provider-profile.interface';

export { Experience, Education, ResumeMeta, SocialLink };

export class ProviderProfile {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly about: string | null,
    public readonly location: string | null,
    public readonly phone: string | null,
    public readonly email: string | null, 
    public readonly avatarFileName: string | null,
    public readonly isAvailable: boolean | null, 
    public readonly dateOfBirth: Date | null,
    public readonly gender: string | null,
    public readonly skills: string[],
    public readonly languages: string[],
    public readonly socialLinks: SocialLink[],
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}

  static create(data: {
    id: string;
    userId: string;
    about?: string;
    location?: string;
    phone?: string;
    email?: string | null; 
    avatarFileName?: string | null;
    isAvailable?: boolean | null;  
    dateOfBirth?: Date | null;
    gender?: string | null;
    skills?: string[];
    languages?: string[];
    socialLinks?: SocialLink[];
    createdAt?: Date;
    updatedAt?: Date;
  }): ProviderProfile {
    const now = new Date();
    return new ProviderProfile(
      data.id,
      data.userId,
      data.about ?? null,
      data.location ?? null,
      data.phone ?? null,
      data.email ?? null,
      data.avatarFileName ?? null,
      data.isAvailable ?? null,
      data.dateOfBirth ?? null,
      data.gender ?? null,
      data.skills ?? [],
      data.languages ?? [],
      data.socialLinks ?? [],
      data.createdAt ?? now,
      data.updatedAt ?? now,
    );
  }

}