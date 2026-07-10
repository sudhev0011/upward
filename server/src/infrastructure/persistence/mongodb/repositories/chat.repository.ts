import { Types } from 'mongoose';
import { IChatRepository } from '../../../../domain/interfaces/repositories/chat/IChatRepository';
import { Conversation } from '../../../../domain/entities/conversation.entity';
import { Message } from '../../../../domain/entities/message.entity';
import { ConversationModel } from '../models/conversation.model';
import { MessageModel } from '../models/message.model';
import { ConversationMapper, MessageMapper } from '../../../mapers.persistence/chat/chat.mapper';

export class MongoChatRepository implements IChatRepository {
  async findOrCreateConversation(clientId: string, providerId: string): Promise<Conversation> {
    const clientOid = new Types.ObjectId(clientId);
    const providerOid = new Types.ObjectId(providerId);

    let doc = await ConversationModel.findOne({
      clientId: clientOid,
      providerId: providerOid,
    });

    if (!doc) {
      doc = await ConversationModel.create({
        clientId: clientOid,
        providerId: providerOid,
        unreadCountClient: 0,
        unreadCountProvider: 0,
      });
    }

    return ConversationMapper.toEntity(doc);
  }

  async findConversationById(conversationId: string): Promise<Conversation | null> {
    if (!Types.ObjectId.isValid(conversationId)) return null;

    const doc = await ConversationModel.findById(new Types.ObjectId(conversationId));
    if (!doc) return null;

    return ConversationMapper.toEntity(doc);
  }

  async findConversationsByUserId(userId: string): Promise<Conversation[]> {
    if (!Types.ObjectId.isValid(userId)) return [];

    const userOid = new Types.ObjectId(userId);
    const docs = await ConversationModel.find({
      $or: [{ clientId: userOid }, { providerId: userOid }],
    }).sort({ updatedAt: -1 });

    return docs.map((doc) => ConversationMapper.toEntity(doc));
  }

  async saveMessage(message: Message): Promise<Message> {
    const doc = await MessageModel.create({
      conversationId: new Types.ObjectId(message.conversationId),
      senderId: new Types.ObjectId(message.senderId),
      text: message.text,
      attachmentUrl: message.attachmentUrl,
      isDelivered: message.isDelivered,
      userStates: message.userStates,
    });

    return MessageMapper.toEntity(doc);
  }

  async findMessagesByConversationId(
    conversationId: string,
    limit: number,
    skip: number
  ): Promise<Message[]> {
    if (!Types.ObjectId.isValid(conversationId)) return [];

    const docs = await MessageModel.find({
      conversationId: new Types.ObjectId(conversationId),
    })
      .sort({ createdAt: 1 })
      .skip(skip)
      .limit(limit);

    return docs.map((doc) => MessageMapper.toEntity(doc));
  }

  async resetUnreadCount(conversationId: string, role: 'client' | 'provider'): Promise<void> {
    if (!Types.ObjectId.isValid(conversationId)) return;

    const updateField = role === 'client' ? { unreadCountClient: 0 } : { unreadCountProvider: 0 };
    await ConversationModel.findByIdAndUpdate(new Types.ObjectId(conversationId), {
      $set: updateField,
    });

    const conversation = await ConversationModel.findById(new Types.ObjectId(conversationId));
    if (conversation) {
      const readerId = role === 'client' ? String(conversation.clientId) : String(conversation.providerId);
      const senderId = role === 'client' ? conversation.providerId : conversation.clientId;

      await MessageModel.updateMany(
        {
          conversationId: new Types.ObjectId(conversationId),
          senderId: senderId,
          [`userStates.${readerId}.isRead`]: false
        },
        {
          $set: {
            [`userStates.${readerId}.isRead`]: true,
            isDelivered: true
          }
        }
      );
    }
  }

  async incrementUnreadCount(conversationId: string, role: 'client' | 'provider'): Promise<void> {
    if (!Types.ObjectId.isValid(conversationId)) return;

    const updateField = role === 'client' ? { unreadCountClient: 1 } : { unreadCountProvider: 1 };
    await ConversationModel.findByIdAndUpdate(new Types.ObjectId(conversationId), {
      $inc: updateField,
    });
  }

  async updateLastMessage(conversationId: string, messageId: string): Promise<void> {
    if (!Types.ObjectId.isValid(conversationId) || !Types.ObjectId.isValid(messageId)) return;

    await ConversationModel.findByIdAndUpdate(new Types.ObjectId(conversationId), {
      $set: { lastMessageId: new Types.ObjectId(messageId) },
    });
  }

  async markMessageAsDeleted(messageId: string, userId: string): Promise<Message | null> {
    if (!Types.ObjectId.isValid(messageId) || !Types.ObjectId.isValid(userId)) return null;

    const messageDoc = await MessageModel.findById(new Types.ObjectId(messageId));
    if (!messageDoc) return null;

    const conversation = await ConversationModel.findById(messageDoc.conversationId);
    if (!conversation) return null;

    const userOid = new Types.ObjectId(userId);
    if (!conversation.clientId.equals(userOid) && !conversation.providerId.equals(userOid)) {
      return null;
    }

    const doc = await MessageModel.findByIdAndUpdate(
      new Types.ObjectId(messageId),
      {
        $set: {
          [`userStates.${userId}.isDeleted`]: true
        }
      },
      { new: true }
    );

    if (!doc) return null;
    return MessageMapper.toEntity(doc);
  }

  async markIncomingMessagesAsDelivered(userId: string): Promise<string[]> {
    if (!Types.ObjectId.isValid(userId)) return [];

    const userOid = new Types.ObjectId(userId);

    const conversations = await ConversationModel.find({
      $or: [{ clientId: userOid }, { providerId: userOid }]
    });

    const updatedConversationIds: string[] = [];

    for (const conv of conversations) {
      const otherParticipantId = String(conv.clientId) === userId ? conv.providerId : conv.clientId;

      const updateResult = await MessageModel.updateMany(
        {
          conversationId: conv._id,
          senderId: otherParticipantId,
          isDelivered: false
        },
        {
          $set: { isDelivered: true }
        }
      );

      if (updateResult.modifiedCount > 0) {
        updatedConversationIds.push(String(conv._id));
      }
    }

    return updatedConversationIds;
  }
}
