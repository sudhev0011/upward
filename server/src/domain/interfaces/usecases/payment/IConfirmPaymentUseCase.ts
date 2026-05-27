export interface IConfirmPaymentUseCase {

  execute(
    stripePaymentIntentId: string
  ): Promise<void>;
}