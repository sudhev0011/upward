import { Types } from 'mongoose';
import { INotificationRepository } from '../../../../domain/interfaces/repositories/notification/INotificationRepository';
import { Notification } from '../../../../domain/entities/notification.entity';
import { NotificationModel, NotificationDocument } from '../models/notification.model';
import { NotificationMapper } from '../../../mapers.persistence/notification/notification.mapper';
import { RepositoryBase } from './base.repository';

export class MongoNotificationRepository 
  extends RepositoryBase<Notification, NotificationDocument> 
  implements INotificationRepository 
{
  constructor() {
    super(NotificationModel);
  }

  protected mapToEntity(document: NotificationDocument): Notification {
    return NotificationMapper.toEntity(document);
  }

  protected mapToDocument(entity: Partial<Notification>): Partial<NotificationDocument> {
    return NotificationMapper.toDocument(entity as Notification);
  }

  async markAllAsRead(recipientId: string): Promise<void> {
    if (!Types.ObjectId.isValid(recipientId)) return;
    await this.model.updateMany(
      { recipientId: new Types.ObjectId(recipientId), isRead: false },
      { $set: { isRead: true } }
    );
  }
}
