import { Message } from '../../../entities/message.entity';

export interface IDeleteMessageUseCase {
  execute(userId: string, messageId: string): Promise<Message | null>;
}
