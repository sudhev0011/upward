import { ClientProfile } from '../../../domain/entities/client-profile.entity';
import { ClientProfileDocument } from '../../persistence/mongodb/models/client-profile.model';
import { Types } from 'mongoose';

export class ClientProfileMapper {
  static toEntity(doc: ClientProfileDocument): ClientProfile {
    return ClientProfile.create({
      id: String(doc._id),
      userId: String(doc.userId),
      location: doc.location || undefined,
      phone: doc.phone || undefined,
      profilePicture: doc.profilePicture || null,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    });
  }

  static toDocument(entity: Partial<ClientProfile>): Partial<ClientProfileDocument> {
    const doc: Partial<ClientProfileDocument> = {};

    if (entity.userId !== undefined) doc.userId = new Types.ObjectId(entity.userId);
    if (entity.location !== undefined) doc.location = entity.location || undefined;
    if (entity.phone !== undefined) doc.phone = entity.phone || undefined;
    if (entity.profilePicture !== undefined) doc.profilePicture = entity.profilePicture || undefined;

    return doc;
  }
}
