import { z } from "zod";

const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;
const TIME_REGEX = /^([01]\d|2[0-3]):([0-5]\d)$/;

export const SetAvailabilityOverrideRequestDtoSchema = z
  .object({
    date: z.string().regex(DATE_REGEX, "Invalid date format, use YYYY-MM-DD"),
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
    (data) => {
      if (data.isWorking) return !!data.startTime && !!data.endTime;
      return true;
    },
    { message: "startTime and endTime are required when isWorking is true" }
  )
  .refine(
    (data) => {
      if (data.isWorking && data.startTime && data.endTime) {
        return data.startTime < data.endTime;
      }
      return true;
    },
    { message: "startTime must be before endTime" }
  );

export type SetAvailabilityOverrideRequestDto = z.infer<
  typeof SetAvailabilityOverrideRequestDtoSchema
>;