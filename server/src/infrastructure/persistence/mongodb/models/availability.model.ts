import { Document, model, Schema, Types } from "mongoose";

export interface DaySchedule {
  isWorking: boolean;
  startTime: string | null; 
  endTime: string | null;   
}

export interface WeeklySchedule {
  sunday: DaySchedule;
  monday: DaySchedule;
  tuesday: DaySchedule;
  wednesday: DaySchedule;
  thursday: DaySchedule;
  friday: DaySchedule;
  saturday: DaySchedule;
}

export interface AvailabilityDocument extends Document {
  providerId: Types.ObjectId;
  timezone: string;
  availabilityWindow: number;
  weeklySchedule: WeeklySchedule;
  createdAt: Date;
  updatedAt: Date;
}

const TIME_REGEX = /^([01]\d|2[0-3]):([0-5]\d)$/;

const DayScheduleSchema = new Schema<DaySchedule>(
  {
    isWorking: { type: Boolean, required: true, default: false },
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
  { _id: false }
);

const WeeklyScheduleSchema = new Schema<WeeklySchedule>(
  {
    sunday:    DayScheduleSchema,
    monday:    DayScheduleSchema,
    tuesday:   DayScheduleSchema,
    wednesday: DayScheduleSchema,
    thursday:  DayScheduleSchema,
    friday:    DayScheduleSchema,
    saturday:  DayScheduleSchema,
  },
  { _id: false }
);

const AvailabilitySchema = new Schema<AvailabilityDocument>(
  {
    providerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },
    timezone: {
      type: String,
      required: true,
      default: "Asia/Kolkata",
    },
    availabilityWindow: {
      type: Number,
      default: 7,
    },
    weeklySchedule: {
      type: WeeklyScheduleSchema,
      required: true,
    },
  },
  { timestamps: true }
);

AvailabilitySchema.pre("save", async function () {
  const days = Object.values(this.weeklySchedule) as DaySchedule[];

  for (const day of days) {
    if (day.isWorking) {
      if (!day.startTime || !day.endTime) {
        throw new Error("startTime and endTime are required when isWorking is true");
      }
      if (day.startTime >= day.endTime) {
        throw new Error("startTime must be before endTime");
      }
    }
  }
});

export const AvailabilityModel = model<AvailabilityDocument>(
  "Availability",
  AvailabilitySchema
);