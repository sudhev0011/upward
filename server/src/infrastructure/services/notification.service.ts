import { INotificationService } from '../../domain/interfaces/services/INotificationService';
import { INotificationRepository } from '../../domain/interfaces/repositories/notification/INotificationRepository';
import { ISocketService } from '../../domain/interfaces/services/ISocketService';
import { Notification } from '../../domain/entities/notification.entity';

export class NotificationService implements INotificationService {
  constructor(
    private readonly _notificationRepository: INotificationRepository,
    private readonly _socketService: ISocketService
  ) {}

  async sendNotification(params: {
    recipientId: string;
    senderId?: string | null;
    title: string;
    message: string;
    type: 'chat' | 'booking' | 'payment' | 'wallet' | 'system';
    data?: Record<string, any> | null;
  }): Promise<Notification> {
    const notification = Notification.create({
      recipientId: params.recipientId,
      senderId: params.senderId ?? null,
      title: params.title,
      message: params.message,
      type: params.type,
      data: params.data,
      isRead: false,
    });

    const savedNotification = await this._notificationRepository.create(notification);

    // Emit live notification using Socket service
    this._socketService.emitToUser(params.recipientId, 'notification_received', savedNotification);

    return savedNotification;
  }
}
