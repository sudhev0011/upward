export interface IMarkMessagesDeliveredUseCase {
  execute(userId: string): Promise<string[]>;
}