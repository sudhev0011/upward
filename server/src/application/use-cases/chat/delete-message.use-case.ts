import { IDeleteMessageUseCase } from "../../../domain/interfaces/usecases/chat/IDeleteMessageUseCase";
import { IChatRepository } from "../../../domain/interfaces/repositories/chat/IChatRepository";
import { Message } from "../../../domain/entities/message.entity";

export class DeleteMessageUseCase implements IDeleteMessageUseCase {
  constructor(private readonly _chatRepository: IChatRepository) {}

  async execute(userId: string, messageId: string): Promise<Message | null> {
    return await this._chatRepository.markMessageAsDeleted(messageId, userId);
  }
}
