import { Document, model, Schema, Types } from "mongoose";
import { UnavailabilitySource } from "../../../../domain/enums/unavailability.enum";

export interface UnavailabilityDocument extends Document {
  providerId: Types.ObjectId;
  startDate: Date;
  endDate: Date;
  reason: string | null;
  source: UnavailabilitySource;
  bookingId: Types.ObjectId | null;
  createdAt: Date;
  updatedAt: Date;
}

const UnavailabilitySchema = new Schema<UnavailabilityDocument>(
  {
    providerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    reason: {
      type: String,
      trim: true,
      default: null,
    },
    source: {
      type: String,
      enum: Object.values(UnavailabilitySource),
      required: true,
    },
    bookingId: {
      type: Schema.Types.ObjectId,
      ref: "Booking",
      default: null,
    },
  },
  { timestamps: true }
);

UnavailabilitySchema.index({ providerId: 1, startDate: 1, endDate: 1 });

UnavailabilitySchema.pre("save", async function () {
  if (this.startDate >= this.endDate) {
    throw new Error("startDate must be before endDate");
  }

  if (this.source === UnavailabilitySource.BOOKING && !this.bookingId) {
    throw new Error("bookingId is required when source is booking");
  }
});

export const UnavailabilityModel = model<UnavailabilityDocument>(
  "Unavailability",
  UnavailabilitySchema
);