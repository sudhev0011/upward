import { Document, model, Schema, Types } from "mongoose";

export interface WalletDocument extends Document {
  userId: Types.ObjectId;
  balance: number;
  createdAt: Date;
  updatedAt: Date;
}

const WalletSchema = new Schema<WalletDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },
    balance: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

export const WalletModel = model<WalletDocument>("Wallet", WalletSchema);
