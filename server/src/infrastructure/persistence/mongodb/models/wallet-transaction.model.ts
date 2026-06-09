import { Document, model, Schema, Types } from "mongoose";
import { WalletTransactionType } from "../../../../domain/entities/wallet-transaction.entity";

export interface WalletTransactionDocument extends Document {
  walletId: Types.ObjectId;
  amount: number;
  type: WalletTransactionType;
  description: string;
  bookingId: Types.ObjectId | null;
  createdAt: Date;
}

const WalletTransactionSchema = new Schema<WalletTransactionDocument>(
  {
    walletId: {
      type: Schema.Types.ObjectId,
      ref: "Wallet",
      required: true,
      index: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0.01,
    },
    type: {
      type: String,
      enum: Object.values(WalletTransactionType),
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    bookingId: {
      type: Schema.Types.ObjectId,
      ref: "Booking",
      default: null,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

export const WalletTransactionModel = model<WalletTransactionDocument>(
  "WalletTransaction",
  WalletTransactionSchema
);
