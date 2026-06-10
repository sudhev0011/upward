import { INotificationRepository } from '../../../domain/interfaces/repositories/notification/INotificationRepository';
import { Notification } from '../../../domain/entities/notification.entity';

export class GetNotificationsUseCase {
  constructor(private readonly _notificationRepository: INotificationRepository) {}

  async execute(
    recipientId: string,
    page: number = 1,
    limit: number = 20
  ): Promise<{ data: Notification[]; total: number }> {
    const result = await this._notificationRepository.paginate(
      { recipientId },
      { page, limit, sortBy: 'createdAt', sortOrder: 'desc' }
    );
    return {
      data: result.data,
      total: result.total,
    };
  }
}
