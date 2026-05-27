import { api } from './axios';
import type { ApiEnvelope } from '@/interfaces/auth';
import type { Conversation, Message } from '@/interfaces/chat.interface';

export const chatApi = {
  async getConversations(): Promise<ApiEnvelope<Conversation[]>> {
    return (await api.get<ApiEnvelope<Conversation[]>>('/api/chat/conversations')).data;
  },

  async getMessages(
    conversationId: string,
    limit: number = 50,
    skip: number = 0
  ): Promise<ApiEnvelope<Message[]>> {
    return (
      await api.get<ApiEnvelope<Message[]>>(`/api/chat/messages/${conversationId}`, {
        params: { limit, skip },
      })
    ).data;
  },

  async findOrCreateConversation(providerId: string): Promise<ApiEnvelope<Conversation>> {
    return (
      await api.post<ApiEnvelope<Conversation>>('/api/chat/conversations', { providerId })
    ).data;
  },

  async resetUnreadCount(
    conversationId: string,
    role: 'client' | 'provider'
  ): Promise<ApiEnvelope<null>> {
    return (
      await api.patch<ApiEnvelope<null>>(`/api/chat/conversations/${conversationId}/reset`, {
        role,
      })
    ).data;
  },
};
