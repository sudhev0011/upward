import { User } from '../../../domain/entities/user.entity';
import { UserDocument } from '../../persistence/mongodb/models/user.model';

export class UserMapper {
  static toEntity(doc: UserDocument): User {
    return User.create({
      id: String(doc._id),
      name: doc.name || '',
      email: doc.email,
      password: doc.password,
      roles: doc.roles,
      avatarFileName: doc.avatarFileName || '',
      isVerified: doc.isVerified,
      isBlocked: doc.isBlocked,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
      refreshToken: doc.refreshToken,
    });
  }

  static toDocument(entity: User): Partial<UserDocument> {
    return {
      name: entity.name,
      email: entity.email,
      password: entity.password,
      roles: entity.roles,
      avatarFileName: entity.avatarFileName,
      isVerified: entity.isVerified,
      isBlocked: entity.isBlocked,
      refreshToken: entity.refreshToken,
    };
  }
}
