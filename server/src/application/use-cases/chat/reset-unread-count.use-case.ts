import { IChatRepository } from '../../../domain/interfaces/repositories/chat/IChatRepository';
import { IResetUnreadCountUseCase } from '../../../domain/interfaces/usecases/chat/IResetUnreadCountUseCase';

export class ResetUnreadCountUseCase implements IResetUnreadCountUseCase {
  constructor(private readonly _chatRepository: IChatRepository) {}

  async execute(conversationId: string, role: 'client' | 'provider'): Promise<void> {
    await this._chatRepository.resetUnreadCount(conversationId, role);
  }
}
