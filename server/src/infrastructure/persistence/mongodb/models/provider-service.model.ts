import { Document, model, Schema, Types } from "mongoose";
import { ProviderServiceStatus } from "../../../../domain/enums/provider-service.status.enum";
export interface ProviderServiceDocument extends Document {
  providerId: Types.ObjectId;
  serviceId: Types.ObjectId;
  price: number | null;
  dailyCapacity: number | null;
  status: ProviderServiceStatus;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ProviderServiceSchema = new Schema(
  {
    providerId: {
      type: Types.ObjectId,
      required: true,
      index: true,
    },

    serviceId: {
      type: Types.ObjectId,
      ref: "Service",
      required: true,
    },

    price: {
      type: Number,
      default: null,
    },

    dailyCapacity: {
      type: Number,
      default: null,
    },

    status: {
      type: String,
      enum: Object.values(ProviderServiceStatus),
      default: ProviderServiceStatus.DRAFT,
    },

    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

ProviderServiceSchema.index({ providerId: 1, serviceId: 1 }, { unique: true });

export const ProviderServiceModel = model<ProviderServiceDocument>(
  "ProviderService",
  ProviderServiceSchema,
);
