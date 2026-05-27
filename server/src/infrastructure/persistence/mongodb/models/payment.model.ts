import {
  Document,
  model,
  Schema,
  Types,
} from "mongoose";

import { PaymentTransactionStatus } from "../../../../domain/enums/payment-transaction-status.enum";

import { PaymentType } from "../../../../domain/enums/payment-type.enum";

export interface PaymentDocument
  extends Document {

  bookingId: Types.ObjectId;

  clientId: Types.ObjectId;

  providerId: Types.ObjectId;

  amount: number;

  currency: string;

  transactionStatus: PaymentTransactionStatus;

  paymentType: PaymentType;

  stripePaymentIntentId: string | null;

  paidAt: Date | null;

  createdAt: Date;

  updatedAt: Date;
}

const PaymentSchema =
  new Schema<PaymentDocument>(
    {
      bookingId: {
        type: Schema.Types.ObjectId,

        ref: "Booking",

        required: true,

        index: true,
      },

      clientId: {
        type: Schema.Types.ObjectId,

        ref: "User",

        required: true,

        index: true,
      },

      providerId: {
        type: Schema.Types.ObjectId,

        ref: "User",

        required: true,

        index: true,
      },

      amount: {
        type: Number,

        required: true,

        min: 1,
      },

      currency: {
        type: String,

        required: true,

        default: "inr",

        lowercase: true,
      },

      transactionStatus: {
        type: String,

        enum: Object.values(
          PaymentTransactionStatus
        ),

        required: true,

        default:
          PaymentTransactionStatus.PENDING,
      },

      paymentType: {
        type: String,

        enum: Object.values(
          PaymentType
        ),

        required: true,
      },

      stripePaymentIntentId: {
        type: String,

        default: null,

        unique: true,

        sparse: true,
      },

      paidAt: {
        type: Date,

        default: null,
      },
    },
    {
      timestamps: true,
    }
  );

  export const PaymentModel = model<PaymentDocument>("Payment", PaymentSchema)