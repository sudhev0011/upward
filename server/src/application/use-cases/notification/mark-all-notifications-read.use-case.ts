import { INotificationRepository } from '../../../domain/interfaces/repositories/notification/INotificationRepository';

export class MarkAllNotificationsReadUseCase {
  constructor(private readonly _notificationRepository: INotificationRepository) {}

  async execute(recipientId: string): Promise<void> {
    await this._notificationRepository.markAllAsRead(recipientId);
  }
}
