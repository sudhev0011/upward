import { SendMessageResult } from '../../../../application/dtos/chats/sendMessageResult.dto';

export interface ISendMessageUseCase {
  execute(
    senderId: string,
    conversationId: string,
    text: string,
    attachmentUrl?: string | null,
  ): Promise<SendMessageResult>;
}
