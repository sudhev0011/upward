import { NotFoundError } from "../../../domain/errors/errors";
import { AddReactionResult } from "../../../domain/interfaces/chat.interface";
import { IChatRepository } from "../../../domain/interfaces/repositories/chat/IChatRepository";
import { IAddMessageReactionUseCase } from "../../../domain/interfaces/usecases/chat/IAddMessageReactionUseCase";

export class AddMessageReactionUseCase implements IAddMessageReactionUseCase {
  constructor(private readonly chatRepository: IChatRepository) {}

  async execute(
    messageId: string,
    userId: string,
    reaction: string,
  ): Promise<AddReactionResult> {
    const result = await this.chatRepository.addReaction(
      messageId,
      userId,
      reaction,
    );

    if (!result) {
      throw new NotFoundError("Message not found or update unauthorized");
    }

    return result;
  }
}
