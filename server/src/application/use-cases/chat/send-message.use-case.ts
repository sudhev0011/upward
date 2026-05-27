import { Message } from '../../../domain/entities/message.entity';
import { IChatRepository } from '../../../domain/interfaces/repositories/chat/IChatRepository';
import { ISendMessageUseCase } from '../../../domain/interfaces/usecases/chat/ISendMessageUseCase';
import { NotFoundError } from '../../../domain/errors/errors';

export class SendMessageUseCase implements ISendMessageUseCase {
  constructor(private readonly _chatRepository: IChatRepository) {}

  async execute(
    senderId: string,
    conversationId: string,
    text: string,
    attachmentUrl?: string | null
  ): Promise<Message> {
    const conversation = await this._chatRepository.findConversationById(conversationId);
    if (!conversation) {
      throw new NotFoundError('Conversation not found');
    }

    const messageEntity = Message.create({
      conversationId,
      senderId,
      text,
      attachmentUrl: attachmentUrl ?? null,
      isRead: false,
    });

    const savedMessage = await this._chatRepository.saveMessage(messageEntity);

    if (savedMessage.id) {
      await this._chatRepository.updateLastMessage(conversationId, savedMessage.id);

      // Determine recipient role to increment unread counts
      // If sender is client, recipient is provider (and vice versa)
      const recipientRole = senderId === conversation.clientId ? 'provider' : 'client';
      await this._chatRepository.incrementUnreadCount(conversationId, recipientRole);
    }

    return savedMessage;
  }
}
