import { Conversation } from '../../../entities/conversation.entity';
import { Message } from '../../../entities/message.entity';
import { AddReactionResult, DeleteMessageResult, ResetUnreadCountResult } from '../../chat.interface';
import { ITransactionContext } from '../../database/transaction-context.interface';

export interface IChatRepository {
  findOrCreateConversation(clientId: string, providerId: string): Promise<Conversation>;
  findConversationById(conversationId: string): Promise<Conversation | null>;
  findConversationsByUserId(userId: string): Promise<Conversation[]>;
  saveMessage(message: Message): Promise<Message>;
  findMessagesByConversationId(conversationId: string, limit: number, skip: number): Promise<Message[]>;
  resetUnreadCount(conversationId: string, userId: string,transaction?: ITransactionContext): Promise<ResetUnreadCountResult | null>;
  incrementUnreadCount(conversationId: string, role: 'client' | 'provider'): Promise<void>;
  updateLastMessage(conversationId: string, messageId: string): Promise<void>;
  markMessageAsDeleted(messageId: string, senderId: string): Promise<DeleteMessageResult | null>;
  markIncomingMessagesAsDelivered(userId: string): Promise<string[]>;
  findMessageByMessageId(messageId: string): Promise<Message | null>;
  addReaction(messageId: string, userId: string, reaction: string): Promise<AddReactionResult | null>;
}
