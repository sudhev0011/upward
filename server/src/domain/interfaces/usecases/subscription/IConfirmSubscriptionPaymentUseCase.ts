export interface IConfirmSubscriptionPaymentUseCase{
    execute(stripePaymentIntentId: string):Promise<void>
}