import { Notification } from '../../../domain/entities/notification.entity';
import { NotificationDocument } from '../../persistence/mongodb/models/notification.model';

export class NotificationMapper {
  static toEntity(doc: NotificationDocument): Notification {
    return Notification.create({
      id: String(doc._id),
      recipientId: String(doc.recipientId),
      senderId: doc.senderId ? String(doc.senderId) : null,
      title: doc.title,
      message: doc.message,
      type: doc.type as 'chat' | 'booking' | 'payment' | 'wallet' | 'system',
      isRead: doc.isRead,
      data: doc.data,
      createdAt: doc.createdAt,
    });
  }

  static toDocument(entity: Notification): Partial<NotificationDocument> {
    return {
      recipientId: entity.recipientId as any,
      senderId: entity.senderId as any,
      title: entity.title,
      message: entity.message,
      type: entity.type,
      isRead: entity.isRead,
      data: entity.data,
    };
  }
}
