import { z } from "zod";

const TIME_REGEX = /^([01]\d|2[0-3]):([0-5]\d)$/;

const DayScheduleSchema = z
  .object({
    isWorking: z.boolean(),
    startTime: z
      .string()
      .regex(TIME_REGEX, "Invalid time format, use HH:mm")
      .nullable()
      .default(null),
    endTime: z
      .string()
      .regex(TIME_REGEX, "Invalid time format, use HH:mm")
      .nullable()
      .default(null),
  })
  .refine(
    (day) => {
      if (day.isWorking) return !!day.startTime && !!day.endTime;
      return true;
    },
    { message: "startTime and endTime are required when isWorking is true" }
  )
  .refine(
    (day) => {
      if (day.isWorking && day.startTime && day.endTime) {
        return day.startTime < day.endTime;
      }
      return true;
    },
    { message: "startTime must be before endTime" }
  );

const WeeklyScheduleSchema = z.object({
  sunday: DayScheduleSchema,
  monday: DayScheduleSchema,
  tuesday: DayScheduleSchema,
  wednesday: DayScheduleSchema,
  thursday: DayScheduleSchema,
  friday: DayScheduleSchema,
  saturday: DayScheduleSchema,
});

export const SetAvailabilityRequestDtoSchema = z.object({
  providerId: z.string(),
  timezone: z.string().default("Asia/Kolkata"),
  availabilityWindow: z.number().default(7),
  weeklySchedule: WeeklyScheduleSchema,
});

export type SetAvailabilityRequestDto = z.infer<
  typeof SetAvailabilityRequestDtoSchema
>;

export const UpdateAvailabilityRequestDtoSchema = z.object({
  providerId: z.string(),
  timezone: z.string().optional(),
  availabilityWindow: z.number().optional(),
  weeklySchedule: WeeklyScheduleSchema.partial().optional(),
});

export type UpdateAvailabilityRequestDto = z.infer<
  typeof UpdateAvailabilityRequestDtoSchema
>;