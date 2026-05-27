import { Message } from '../../../domain/entities/message.entity';
import { IChatRepository } from '../../../domain/interfaces/repositories/chat/IChatRepository';
import { IGetMessagesUseCase } from '../../../domain/interfaces/usecases/chat/IGetMessagesUseCase';

export class GetMessagesUseCase implements IGetMessagesUseCase {
  constructor(private readonly _chatRepository: IChatRepository) {}

  async execute(conversationId: string, limit: number, skip: number): Promise<Message[]> {
    return this._chatRepository.findMessagesByConversationId(conversationId, limit, skip);
  }
}
