export interface IExpireStalePendingSubscriptionsUseCase {
  execute(staleAfterMinutes?: number): Promise<number>;
}