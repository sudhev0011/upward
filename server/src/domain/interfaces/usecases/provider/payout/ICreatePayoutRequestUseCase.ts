export interface ICreatePayoutRequestUseCase {
  execute(providerId: string, amount: number): Promise<void>;
}
