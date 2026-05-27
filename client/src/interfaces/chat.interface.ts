export interface Message {
  id?: string;
  conversationId: string;
  senderId: string;
  text: string;
  attachmentUrl: string | null;
  isRead: boolean;
  createdAt: string;
}

export interface ChatParticipant {
  id: string;
  name: string;
  email: string;
  avatar: string | null;
}

export interface Conversation {
  id: string;
  clientId: string;
  providerId: string;
  unreadCountClient: number;
  unreadCountProvider: number;
  createdAt: string;
  updatedAt: string;
  lastMessage: Message | null;
  participant: ChatParticipant | null;
}
