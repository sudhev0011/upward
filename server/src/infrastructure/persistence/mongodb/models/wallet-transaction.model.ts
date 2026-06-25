import { Document, model, Schema, Types } from "mongoose";
import { WalletTransactionCategory } from "../../../../domain/enums/wallet-transaction-category.enum";
import { WalletTransactionType } from "../../../../domain/enums/wallet-transaction.type.enum";

export interface WalletTransactionDocument extends Document {
  walletId: Types.ObjectId;
  amount: number;
  type: WalletTransactionType;
  category: WalletTransactionCategory;
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
    category: {
      type: String,

      enum: Object.values(WalletTransactionCategory),

      required: true,

      index: true,
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
  },
);

export const WalletTransactionModel = model<WalletTransactionDocument>(
  "WalletTransaction",
  WalletTransactionSchema,
);
