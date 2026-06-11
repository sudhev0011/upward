export interface IConfirmRemainingPaymentUseCase {
  execute(stripePaymentIntentId: string): Promise<void>;
}