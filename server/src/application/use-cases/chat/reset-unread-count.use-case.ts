import { IChatRepository } from "../../../domain/interfaces/repositories/chat/IChatRepository";
import { ITransactionManager } from "../../../domain/interfaces/database/transaction-manager.interface";
import { IResetUnreadCountUseCase } from "../../../domain/interfaces/usecases/chat/IResetUnreadCountUseCase";
import { ResetUnreadCountResult } from "../../../domain/interfaces/chat.interface";

export class ResetUnreadCountUseCase
  implements IResetUnreadCountUseCase {

  constructor(
    private readonly chatRepository: IChatRepository,
    private readonly transactionManager: ITransactionManager,
  ) {}

  async execute(
    conversationId: string,
    userId: string,
  ): Promise<ResetUnreadCountResult> {

    return this.transactionManager.runInTransaction(
      async (transaction) => {

        const result =
          await this.chatRepository.resetUnreadCount(
            conversationId,
            userId,
            transaction,
          );

        if (!result) {
          throw new Error("Conversation not found");
        }

        return result;

      },
    );
  }
}