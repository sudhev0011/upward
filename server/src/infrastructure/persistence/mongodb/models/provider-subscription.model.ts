import { Schema, model, Document, Types } from "mongoose";

export interface ProviderSubscriptionDocument extends Document {
  providerId: Types.ObjectId;
  planId: Types.ObjectId;
  amount: number;
  status: "pending" | "active" | "expired" | "cancelled";
  startDate: Date | null;
  endDate: Date | null;
  stripePaymentIntentId: string | null;
  createdAt: Date;
  updatedAt: Date;
}

const ProviderSubscriptionSchema = new Schema<ProviderSubscriptionDocument>(
  {
    providerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    planId: {
      type: Schema.Types.ObjectId,
      ref: "SubscriptionPlan",
      required: true,
      index: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: ["pending", "active", "expired", "cancelled"],
      required: true,
      default: "pending",
      index: true,
    },
    startDate: {
      type: Date,
      default: null,
    },
    endDate: {
      type: Date,
      default: null,
      index: true,
    },
    stripePaymentIntentId: {
      type: String,
      default: null,
      unique: true,
      sparse: true,
    },
  },
  {
    timestamps: true,
  },
);

export const ProviderSubscriptionModel = model<ProviderSubscriptionDocument>(
  "ProviderSubscription",
  ProviderSubscriptionSchema,
);
