import { ProviderProfile } from '../../../domain/entities/provider-profile.entity';
import { ProviderProfileDocument } from '../../persistence/mongodb/models/provider-profile.model';
import { Types } from 'mongoose';

export class ProviderProfileMapper {
  static toEntity(doc: ProviderProfileDocument): ProviderProfile {
    return ProviderProfile.create({
      id: String(doc._id),
      userId: String(doc.userId),
      location: doc.location || undefined,
      phone: doc.phone || undefined,
      bio: doc.bio || undefined,
      dateOfBirth: doc.dateOfBirth || null,
      experience: doc.experience || null,
      gender: doc.gender || null,
      languages: doc.languages || null,
      skills: doc.skills || null,
      socialLinks: doc.socialLinks || null,  
      avatarUrl: doc.avatarUrl || null,
      ratingCount: doc.ratingCount || 0,
      ratingAvg: doc.ratingAvg || 0,
      isApprovedByAdmin: doc.isApprovedByAdmin || false,
      activeSubscriptionExpiresAt: doc.activeSubscriptionExpiresAt || null,
      activeSubscriptionPlanName: doc.activeSubscriptionPlanName || null,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    });
  }

  static toDocument(entity: Partial<ProviderProfile>): Partial<ProviderProfileDocument> {
    const doc: Partial<ProviderProfileDocument> = {};

    if (entity.userId !== undefined) doc.userId = new Types.ObjectId(entity.userId);
    if (entity.location !== undefined) doc.location = entity.location || undefined;
    if (entity.phone !== undefined) doc.phone = entity.phone || undefined;
    if (entity.avatarUrl !== undefined) doc.avatarUrl = entity.avatarUrl || undefined;
    if (entity.bio !== undefined) doc.bio = entity.bio || undefined;
    if (entity.dateOfBirth !== undefined) doc.dateOfBirth = entity.dateOfBirth || undefined;
    if (entity.gender !== undefined) doc.gender = entity.gender || undefined;
    if (entity.languages !== undefined) doc.languages = entity.languages || undefined;
    if (entity.experience !== undefined) doc.experience = entity.experience || undefined;
    if (entity.skills !== undefined) doc.skills = entity.skills || undefined;
    if (entity.socialLinks !== undefined) doc.socialLinks = entity.socialLinks || undefined;
    if (entity.ratingCount !== undefined) doc.ratingCount = entity.ratingCount || 0;
    if (entity.ratingAvg !== undefined) doc.ratingAvg = entity.ratingAvg || 0;
    if (entity.isApprovedByAdmin !== undefined) doc.isApprovedByAdmin = entity.isApprovedByAdmin || false;
    if (entity.activeSubscriptionExpiresAt !== undefined) doc.activeSubscriptionExpiresAt = entity.activeSubscriptionExpiresAt;
    if (entity.activeSubscriptionPlanName !== undefined) doc.activeSubscriptionPlanName = entity.activeSubscriptionPlanName;
    return doc;
  }
}
