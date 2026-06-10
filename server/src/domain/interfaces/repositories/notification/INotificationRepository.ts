import { Notification } from '../../../entities/notification.entity';
import { IBaseRepository } from '../base/IBaseRepository';

export interface INotificationRepository extends IBaseRepository<Notification> {
  markAllAsRead(recipientId: string): Promise<void>;
}
