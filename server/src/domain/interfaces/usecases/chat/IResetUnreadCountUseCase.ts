export interface IResetUnreadCountUseCase {
  execute(conversationId: string, role: 'client' | 'provider'): Promise<void>;
}
