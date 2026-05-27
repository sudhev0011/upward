import Stripe from "stripe";

import {
  CreatePaymentIntentData,
  CreatePaymentIntentResult,
  IPaymentGateway,
  VerifyWebhookResult,
} from "../../../domain/interfaces/services/payment/IPaymentGateway";

import { env } from "../../config/env";

export class StripeService implements IPaymentGateway {
  private stripe: Stripe.Stripe;

  constructor() {
    this.stripe = new Stripe(env.STRIPE_SECRET_KEY, {
      apiVersion: "2026-04-22.dahlia",
    });
  }

  async createPaymentIntent(
    data: CreatePaymentIntentData,
  ): Promise<CreatePaymentIntentResult> {
    const paymentIntent = await this.stripe.paymentIntents.create({
      amount: Math.round(data.amount * 100),

      currency: data.currency,

      metadata: data.metadata,

      automatic_payment_methods: {
        enabled: true,
      },
    });

    return {
      paymentIntentId: paymentIntent.id,

      clientSecret: paymentIntent.client_secret!,
    };
  }

  verifyWebhookEvent(signature: string, payload: Buffer): VerifyWebhookResult {
    const event = this.stripe.webhooks.constructEvent(
      payload,
      signature,
      env.STRIPE_WEBHOOK_SECRET,
    );

    const paymentIntent = event.data.object as Awaited<
      ReturnType<Stripe.Stripe["paymentIntents"]["create"]>
    >;

    return {
      type: event.type,

      paymentIntentId: paymentIntent.id,
    };
  }

  async retrievePaymentIntent(
    paymentIntentId: string,
  ): Promise<CreatePaymentIntentResult> {
    const paymentIntent =
      await this.stripe.paymentIntents.retrieve(paymentIntentId);

    return {
      paymentIntentId: paymentIntent.id,

      clientSecret: paymentIntent.client_secret!,
    };
  }
}
