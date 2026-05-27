  import { SocialLink } from '../interfaces/provider-profile.interface';
  import { Location } from '../interfaces/provider-profile.interface';
  export { SocialLink };

  export class ProviderProfile {
    constructor(
      public readonly id: string,
      public readonly userId: string,
      public readonly bio: string | null,
      public readonly location: Location | null,
      public readonly phone: string | null,
      public readonly avatarUrl: string | null, 
      public readonly dateOfBirth: Date | null,
      public readonly gender: string | null,
      public readonly skills: string[],
      public readonly languages: string[],
      public readonly experience: string | null,
      public readonly ratingCount: number,
      public readonly ratingAvg: number,
      public readonly isApprovedByAdmin: boolean,
      public readonly socialLinks: SocialLink[],
      public readonly categories: string[],
      public readonly activeSubscriptionExpiresAt: Date | null,
      public readonly activeSubscriptionPlanName: string | null,
      public readonly createdAt: Date,
      public readonly updatedAt: Date,
    ) {}

    static create(data: {
      id: string;
      userId: string;
      bio?: string;
      location?: Location;
      phone?: string;
      avatarUrl?: string | null; 
      dateOfBirth?: Date | null;
      gender?: string | null;
      skills?: string[];
      languages?: string[];
      experience?: string | null,
      ratingCount?: number | null,
      ratingAvg?: number | null,
      isApprovedByAdmin?: boolean,
      socialLinks?: SocialLink[];
      categories?: string[];
      activeSubscriptionExpiresAt?: Date | null;
      activeSubscriptionPlanName?: string | null;
      createdAt?: Date;
      updatedAt?: Date;
    }): ProviderProfile {
      const now = new Date();
      return new ProviderProfile(
        data.id,
        data.userId,
        data.bio ?? null,
        data.location ?? null,
        data.phone ?? null,
        data.avatarUrl ?? null,
        data.dateOfBirth ?? null,
        data.gender ?? null,
        data.skills ?? [],
        data.languages ?? [],
        data.experience ?? null,
        data.ratingCount ?? 0,
        data.ratingAvg ?? 0,
        data.isApprovedByAdmin ?? false, 
        data.socialLinks ?? [],
        data.categories ?? [],
        data.activeSubscriptionExpiresAt ?? null,
        data.activeSubscriptionPlanName ?? null,
        data.createdAt ?? now,
        data.updatedAt ?? now,
      );
    }

  }