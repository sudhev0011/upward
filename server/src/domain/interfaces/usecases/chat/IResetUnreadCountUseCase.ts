import { ResetUnreadCountResult } from "../../chat.interface";

export interface IResetUnreadCountUseCase {
  execute(conversationId: string, userId: string): Promise<ResetUnreadCountResult>;
}
