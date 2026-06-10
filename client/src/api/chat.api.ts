import { api } from './axios';
import type { ApiEnvelope } from '@/interfaces/auth';
import type { Conversation, Message } from '@/interfaces/chat.interface';
import { ChatRoutes } from '@/constants/api-routes';

export const chatApi = {
  async getConversations(): Promise<ApiEnvelope<Conversation[]>> {
    return (await api.get<ApiEnvelope<Conversation[]>>(ChatRoutes.GET_CONVERSATION)).data;
  },

  async getMessages(
    conversationId: string,
    limit: number = 50,
    skip: number = 0
  ): Promise<ApiEnvelope<Message[]>> {
    return (
      await api.get<ApiEnvelope<Message[]>>(ChatRoutes.GET_MESSAGES.replace(":conversationId",conversationId), {
        params: { limit, skip },
      })
    ).data;
  },

  async findOrCreateConversation(providerId: string): Promise<ApiEnvelope<Conversation>> {
    return (
      await api.post<ApiEnvelope<Conversation>>(ChatRoutes.FIND_OR_CREATE_CONVERSATION, { providerId })
    ).data;
  },

  async resetUnreadCount(
    conversationId: string,
    role: 'client' | 'provider'
  ): Promise<ApiEnvelope<null>> {
    return (
      await api.patch<ApiEnvelope<null>>(ChatRoutes.RESET_UNREAD_COUNT.replace(":conversationId", conversationId), {
        role,
      })
    ).data;
  },

  async getUploadUrl(
    fileName: string,
    contentType: string
  ): Promise<ApiEnvelope<{ uploadUrl: string; fileUrl: string; storageKey: string }>> {
    return (
      await api.get<ApiEnvelope<{ uploadUrl: string; fileUrl: string; storageKey: string }>>(
        ChatRoutes.GET_UPLOAD_URL,
        {
          params: { fileName, contentType },
        }
      )
    ).data;
  },
};
