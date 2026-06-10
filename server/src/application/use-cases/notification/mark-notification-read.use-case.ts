import { INotificationRepository } from '../../../domain/interfaces/repositories/notification/INotificationRepository';

export class MarkNotificationReadUseCase {
  constructor(private readonly _notificationRepository: INotificationRepository) {}

  async execute(notificationId: string): Promise<void> {
    await this._notificationRepository.update(notificationId, { isRead: true });
  }
}
