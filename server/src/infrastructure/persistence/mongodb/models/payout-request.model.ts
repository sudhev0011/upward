import { Schema, model, Document, Types } from "mongoose";

export interface PayoutRequestDocument extends Document {
  providerId: Types.ObjectId;
  amount: number;
  status: "pending" | "transferred" | "rejected";
  adminNotes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const PayoutRequestSchema = new Schema<PayoutRequestDocument>(
  {
    providerId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
      index: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "transferred", "rejected"],
      default: "pending",
    },
    adminNotes: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);

export const PayoutRequestModel = model<PayoutRequestDocument>(
  "PayoutRequest",
  PayoutRequestSchema
);
