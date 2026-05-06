import { Document, model, Schema, Types } from "mongoose";

export interface AvailabilityOverrideDocument extends Document {
  providerId: Types.ObjectId;
  date: string;           // "YYYY-MM-DD"
  isWorking: boolean;
  startTime: string | null; // "HH:mm"
  endTime: string | null;   // "HH:mm"
  createdAt: Date;
  updatedAt: Date;
}

const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;
const TIME_REGEX = /^([01]\d|2[0-3]):([0-5]\d)$/;

const AvailabilityOverrideSchema = new Schema<AvailabilityOverrideDocument>(
  {
    providerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    date: {
      type: String,
      required: true,
      match: [DATE_REGEX, "Invalid date format, use YYYY-MM-DD"],
    },
    isWorking: {
      type: Boolean,
      required: true,
      default: true,
    },
    startTime: {
      type: String,
      match: [TIME_REGEX, "Invalid time format, use HH:mm"],
      default: null,
    },
    endTime: {
      type: String,
      match: [TIME_REGEX, "Invalid time format, use HH:mm"],
      default: null,
    },
  },
  { timestamps: true }
);

AvailabilityOverrideSchema.index({ providerId: 1, date: 1 }, { unique: true });

AvailabilityOverrideSchema.pre("save", async function () {
  if (this.isWorking) {
    if (!this.startTime || !this.endTime) {
      throw new Error("startTime and endTime are required when isWorking is true");
    }
    if (this.startTime >= this.endTime) {
      throw new Error("startTime must be before endTime");
    }
  } else {
    this.startTime = null;
    this.endTime = null;
  }
});

export const AvailabilityOverrideModel = model<AvailabilityOverrideDocument>(
  "AvailabilityOverride",
  AvailabilityOverrideSchema
);