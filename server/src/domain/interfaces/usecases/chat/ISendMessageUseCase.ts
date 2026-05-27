import { Message } from '../../../entities/message.entity';

export interface ISendMessageUseCase {
  execute(
    senderId: string,
    conversationId: string,
    text: string,
    attachmentUrl?: string | null
  ): Promise<Message>;
}
