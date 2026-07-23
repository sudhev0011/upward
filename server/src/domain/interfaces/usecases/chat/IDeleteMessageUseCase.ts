import { DeleteMessageResult } from '../../../../application/dtos/chats/deleteMessageResult.dto';

export interface IDeleteMessageUseCase {
  execute(userId: string, messageId: string): Promise<DeleteMessageResult>;
}
