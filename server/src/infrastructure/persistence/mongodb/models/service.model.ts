import { model, Schema, Types } from "mongoose";
import { Document } from "mongoose";

export interface ServiceDocument extends Document {
  categoryId: Types.ObjectId;
  name: string;
  description: string | null;
  maxHour: number | null;
  mode: "onsite" | "offsite" | "both";
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ServiceSchema = new Schema<ServiceDocument>(
  {
    categoryId: {
      type: Types.ObjectId,
      ref: "Category",
      required: true,
    },

    name: { type: String, required: true },
    description: {
      type: String,
      default: null,
    },

    maxHour: {type: Number},

    mode: {
      type: String,
      enum: ["onsite", "offsite", "both"],
      required: true,
    },

    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export const ServiceModel = model<ServiceDocument>("Service", ServiceSchema);
