import { Conversation } from '../../../entities/conversation.entity';
import { Message } from '../../../entities/message.entity';

export interface IChatRepository {
  findOrCreateConversation(clientId: string, providerId: string): Promise<Conversation>;
  findConversationById(conversationId: string): Promise<Conversation | null>;
  findConversationsByUserId(userId: string): Promise<Conversation[]>;
  saveMessage(message: Message): Promise<Message>;
  findMessagesByConversationId(conversationId: string, limit: number, skip: number): Promise<Message[]>;
  resetUnreadCount(conversationId: string, role: 'client' | 'provider'): Promise<void>;
  incrementUnreadCount(conversationId: string, role: 'client' | 'provider'): Promise<void>;
  updateLastMessage(conversationId: string, messageId: string): Promise<void>;
}
