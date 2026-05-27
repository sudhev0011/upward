import { Conversation } from '../../../entities/conversation.entity';

export interface IFindOrCreateConversationUseCase {
  execute(clientId: string, providerId: string): Promise<Conversation>;
}
