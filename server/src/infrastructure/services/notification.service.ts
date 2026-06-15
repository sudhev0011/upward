import { INotificationService } from '../../domain/interfaces/services/INotificationService';
import { INotificationRepository } from '../../domain/interfaces/repositories/notification/INotificationRepository';
import { ISocketService } from '../../domain/interfaces/services/ISocketService';
import { Notification } from '../../domain/entities/notification.entity';
import { IPushNotificationService } from '../../domain/interfaces/services/push-notification/IPushNotificationService';

export class NotificationService implements INotificationService {
  constructor(
    private readonly _notificationRepository: INotificationRepository,
    private readonly _socketService: ISocketService,
    private readonly _pushNotificationService: IPushNotificationService
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

    this._socketService.emitToUser(params.recipientId, 'notification_received', savedNotification);

    this._pushNotificationService.sendToUser(
      params.recipientId,
      params.title,
      params.message,
      { 
        type: params.type, 
        notificationId: String(savedNotification.id),
        ...params.data 
      }
    ).catch(err => console.error("Push Dispatch Error: ", err));

    return savedNotification;
  }
}