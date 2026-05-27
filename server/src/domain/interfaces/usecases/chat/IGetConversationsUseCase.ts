import { Message } from '../../../entities/message.entity';

export interface ChatParticipantDto {
  id: string;
  name: string;
  email: string;
  avatar: string | null;
}

export interface ConversationResponseDto {
  id: string;
  clientId: string;
  providerId: string;
  unreadCountClient: number;
  unreadCountProvider: number;
  createdAt: Date;
  updatedAt: Date;
  lastMessage: Message | null;
  participant: ChatParticipantDto | null;
}

export interface IGetConversationsUseCase {
  execute(userId: string): Promise<ConversationResponseDto[]>;
}
