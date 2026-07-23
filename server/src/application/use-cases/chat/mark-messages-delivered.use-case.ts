import { IChatRepository } from "../../../domain/interfaces/repositories/chat/IChatRepository";
import { IMarkMessagesDeliveredUseCase } from "../../../domain/interfaces/usecases/chat/IMarkMessagesDeliveredUseCase";

export class MarkMessagesDeliveredUseCase
  implements IMarkMessagesDeliveredUseCase
{
  constructor(
    private readonly chatRepository: IChatRepository
  ) {}

  async execute(userId: string): Promise<string[]> {
    return await this.chatRepository.markIncomingMessagesAsDelivered(userId);
  }
}