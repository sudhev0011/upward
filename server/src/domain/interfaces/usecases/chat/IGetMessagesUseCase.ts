import { Message } from '../../../entities/message.entity';

export interface IGetMessagesUseCase {
  execute(conversationId: string, limit: number, skip: number): Promise<Message[]>;
}
