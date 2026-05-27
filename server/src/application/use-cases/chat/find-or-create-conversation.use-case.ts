import { Conversation } from '../../../domain/entities/conversation.entity';
import { IChatRepository } from '../../../domain/interfaces/repositories/chat/IChatRepository';
import { IFindOrCreateConversationUseCase } from '../../../domain/interfaces/usecases/chat/IFindOrCreateConversationUseCase';

export class FindOrCreateConversationUseCase implements IFindOrCreateConversationUseCase {
  constructor(private readonly _chatRepository: IChatRepository) {}

  async execute(clientId: string, providerId: string): Promise<Conversation> {
    return this._chatRepository.findOrCreateConversation(clientId, providerId);
  }
}
