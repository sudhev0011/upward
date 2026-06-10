import { INotificationRepository } from '../../../domain/interfaces/repositories/notification/INotificationRepository';

export class GetUnreadNotificationsCountUseCase {
  constructor(private readonly _notificationRepository: INotificationRepository) {}

  async execute(recipientId: string): Promise<number> {
    return this._notificationRepository.countDocuments({ recipientId, isRead: false });
  }
}
