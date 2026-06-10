import { Notification } from '../../entities/notification.entity';

export interface INotificationService {
  sendNotification(params: {
    recipientId: string;
    senderId?: string | null;
    title: string;
    message: string;
    type: 'chat' | 'booking' | 'payment' | 'wallet' | 'system';
    data?: Record<string, any> | null;
  }): Promise<Notification>;
}
