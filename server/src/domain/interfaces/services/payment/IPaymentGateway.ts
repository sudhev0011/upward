export interface CreatePaymentIntentData {
  amount: number;

  currency: string;

  metadata: Record<string, string>;
}

export interface CreatePaymentIntentResult {
  paymentIntentId: string;

  clientSecret: string;
}

export interface VerifyWebhookResult {
  type: string;

  paymentIntentId: string;
}

export interface IPaymentGateway {
  createPaymentIntent(
    data: CreatePaymentIntentData,
  ): Promise<CreatePaymentIntentResult>;

  verifyWebhookEvent(
    signature: string,

    payload: Buffer,
  ): VerifyWebhookResult;

  retrievePaymentIntent(
    paymentIntentId: string,
  ): Promise<CreatePaymentIntentResult>;
}
