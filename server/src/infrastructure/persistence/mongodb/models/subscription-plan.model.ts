import { Schema, model, Document } from "mongoose";

export interface SubscriptionPlanDocument extends Document {
  name: string;
  price: number;
  billingCycle: "monthly" | "yearly";
  features: string[];
  subscriberCount: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const SubscriptionPlanSchema = new Schema<SubscriptionPlanDocument>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    billingCycle: {
      type: String,
      enum: ["monthly", "yearly"],
      required: true,
      default: "monthly",
    },
    features: {
      type: [String],
      default: [],
    },
    subscriberCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  {
    timestamps: true,
  },
);

export const SubscriptionPlanModel = model<SubscriptionPlanDocument>(
  "SubscriptionPlan",
  SubscriptionPlanSchema,
);
