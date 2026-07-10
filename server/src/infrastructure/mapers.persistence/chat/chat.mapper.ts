import { Conversation } from '../../../domain/entities/conversation.entity';
import { Message } from '../../../domain/entities/message.entity';
import { ConversationDocument } from '../../persistence/mongodb/models/conversation.model';
import { MessageDocument } from '../../persistence/mongodb/models/message.model';

export class ConversationMapper {
  static toEntity(doc: ConversationDocument): Conversation {
    return Conversation.create({
      id: String(doc._id),
      clientId: String(doc.clientId),
      providerId: String(doc.providerId),
      lastMessageId: doc.lastMessageId ? String(doc.lastMessageId) : null,
      unreadCountClient: doc.unreadCountClient,
      unreadCountProvider: doc.unreadCountProvider,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    });
  }
}

export class MessageMapper {
  static toEntity(doc: MessageDocument): Message {
    const userStates: Record<string, { isRead: boolean; isDeleted: boolean }> = {};
    if (doc.userStates) {
      doc.userStates.forEach((val, key) => {
        userStates[key] = { isRead: val.isRead, isDeleted: val.isDeleted };
      });
    }

    return Message.create({
      id: String(doc._id),
      conversationId: String(doc.conversationId),
      senderId: String(doc.senderId),
      text: doc.text,
      attachmentUrl: doc.attachmentUrl,
      isDelivered: doc.isDelivered,
      userStates,
      createdAt: doc.createdAt,
    });
  }
}
