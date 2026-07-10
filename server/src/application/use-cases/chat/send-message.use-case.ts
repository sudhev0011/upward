import { Message } from '../../../domain/entities/message.entity';
import { IChatRepository } from '../../../domain/interfaces/repositories/chat/IChatRepository';
import { ISendMessageUseCase } from '../../../domain/interfaces/usecases/chat/ISendMessageUseCase';
import { NotFoundError } from '../../../domain/errors/errors';
import { IUserRepository } from '../../../domain/interfaces/repositories/user/IUserRepository';
import { INotificationService } from '../../../domain/interfaces/services/INotificationService';

export class SendMessageUseCase implements ISendMessageUseCase {
  constructor(
    private readonly _chatRepository: IChatRepository,
    private readonly _userRepository: IUserRepository,
    private readonly _notificationService: INotificationService
  ) {}

  async execute(
    senderId: string,
    conversationId: string,
    text: string,
    attachmentUrl?: string | null,
    isDelivered?: boolean
  ): Promise<Message> {
    const conversation = await this._chatRepository.findConversationById(conversationId);
    if (!conversation) {
      throw new NotFoundError('Conversation not found');
    }

    const recipientRole = senderId === conversation.clientId ? 'provider' : 'client';
    const recipientId = recipientRole === 'provider' ? String(conversation.providerId) : String(conversation.clientId);

    const userStates = {
      [senderId]: { isRead: true, isDeleted: false },
      [recipientId]: { isRead: false, isDeleted: false }
    };

    const messageEntity = Message.create({
      conversationId,
      senderId,
      text,
      attachmentUrl: attachmentUrl ?? null,
      isDelivered: isDelivered ?? false,
      userStates
    });

    const savedMessage = await this._chatRepository.saveMessage(messageEntity);

    if (savedMessage.id) {
      await this._chatRepository.updateLastMessage(conversationId, savedMessage.id);

      const recipientRole = senderId === conversation.clientId ? 'provider' : 'client';
      await this._chatRepository.incrementUnreadCount(conversationId, recipientRole);

      // Retrieve sender name and dispatch notification to recipient
      const recipientId = senderId === conversation.clientId ? conversation.providerId : conversation.clientId;
      const sender = await this._userRepository.findById(senderId);
      const senderName = sender ? sender.name : 'Someone';
      const notificationMessage = text ? text : 'Sent an attachment';

      await this._notificationService.sendNotification({
        recipientId,
        senderId,
        title: `New message from ${senderName}`,
        message: notificationMessage,
        type: 'chat',
        data: { conversationId, messageId: savedMessage.id }
      });
    }

    return savedMessage;
  }
}
