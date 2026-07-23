import { IDeleteMessageUseCase } from "../../../domain/interfaces/usecases/chat/IDeleteMessageUseCase";
import { IChatRepository } from "../../../domain/interfaces/repositories/chat/IChatRepository";
import { DeleteMessageResult } from "../../dtos/chats/deleteMessageResult.dto";

export class DeleteMessageUseCase implements IDeleteMessageUseCase {
  constructor(private readonly chatRepository: IChatRepository) {}

  async execute(
    userId: string,
    messageId: string,
  ): Promise<DeleteMessageResult> {
    const result = await this.chatRepository.markMessageAsDeleted(
      messageId,
      userId,
    );

    if (!result) {
      throw new Error("Message not found or unauthorized");
    }

    return result;
  }
}
