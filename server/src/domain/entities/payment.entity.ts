
import { PaymentTransactionStatus } from "../enums/payment-transaction-status.enum";
import { PaymentType } from "../enums/payment-type.enum";

import {
  ValidationError,
} from "../errors/errors";

export class Payment {
  constructor(
    public readonly id: string | undefined,

    public readonly bookingId: string,

    public readonly clientId: string,

    public readonly providerId: string,

    public readonly amount: number,

    public readonly currency: string,

    public readonly transactionStatus: PaymentTransactionStatus,

    public readonly paymentType: PaymentType,

    public readonly stripePaymentIntentId: string | null,

    public readonly paidAt: Date | null,

    public readonly createdAt: Date,

    public readonly updatedAt: Date,
  ) {}

  static create(data: {
    id?: string;

    bookingId: string;

    clientId: string;

    providerId: string;

    amount: number;

    currency?: string;

    transactionStatus?: PaymentTransactionStatus;

    paymentType: PaymentType;

    stripePaymentIntentId?: string | null;

    paidAt?: Date | null;

    createdAt?: Date;

    updatedAt?: Date;
  }): Payment {

    if (data.amount <= 0) {
      throw new ValidationError(
        "Payment amount must be greater than zero"
      );
    }

    const now = new Date();

    return new Payment(
      data.id,

      data.bookingId,

      data.clientId,

      data.providerId,

      data.amount,

      data.currency ?? "inr",

      data.transactionStatus ??
        PaymentTransactionStatus.PENDING,

      data.paymentType,

      data.stripePaymentIntentId ?? null,

      data.paidAt ?? null,

      data.createdAt ?? now,

      data.updatedAt ?? now,
    );
  }

  /**
   * Mark payment successful
   */

  markSucceeded(
    stripePaymentIntentId: string,
  ): Payment {

    return new Payment(
      this.id,

      this.bookingId,

      this.clientId,

      this.providerId,

      this.amount,

      this.currency,

      PaymentTransactionStatus.SUCCEEDED,

      this.paymentType,

      stripePaymentIntentId,

      new Date(),

      this.createdAt,

      new Date(),
    );
  }

  /**
   * Mark payment failed
   */

  markFailed(): Payment {

    return new Payment(
      this.id,

      this.bookingId,

      this.clientId,

      this.providerId,

      this.amount,

      this.currency,

      PaymentTransactionStatus.FAILED,

      this.paymentType,

      this.stripePaymentIntentId,

      this.paidAt,

      this.createdAt,

      new Date(),
    );
  }

  /**
   * Mark payment refunded
   */

  markRefunded(): Payment {

    return new Payment(
      this.id,

      this.bookingId,

      this.clientId,

      this.providerId,

      this.amount,

      this.currency,

      PaymentTransactionStatus.REFUNDED,

      this.paymentType,

      this.stripePaymentIntentId,

      this.paidAt,

      this.createdAt,

      new Date(),
    );
  }

  /**
   * Attach Stripe PaymentIntent ID
   */

  attachStripePaymentIntent(
    paymentIntentId: string,
  ): Payment {

    if (!paymentIntentId.trim()) {
      throw new ValidationError(
        "Stripe payment intent ID is required"
      );
    }

    return new Payment(
      this.id,

      this.bookingId,

      this.clientId,

      this.providerId,

      this.amount,

      this.currency,

      this.transactionStatus,

      this.paymentType,

      paymentIntentId,

      this.paidAt,

      this.createdAt,

      new Date(),
    );
  }
}