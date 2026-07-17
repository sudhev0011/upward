import { Message } from "../../../domain/entities/message.entity";
import { IChatRepository } from "../../../domain/interfaces/repositories/chat/IChatRepository";
import { IAddMessageReactionUseCase } from "../../../domain/interfaces/usecases/chat/IAddMessageReactionUseCase";

export class AddMessageReactionUseCase implements IAddMessageReactionUseCase {
  constructor(private readonly chatRepository: IChatRepository) {}

  async execute(messageId: string, userId: string, reaction: string): Promise<Message | null> {
    return this.chatRepository.addReaction(messageId, userId, reaction);
  }
}