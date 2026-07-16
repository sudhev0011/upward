import { z } from "zod";
import { LocationSchema } from "../common/location/location.dto";

const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;
const TIME_REGEX = /^([01]\d|2[0-3]):([0-5]\d)$/;

/**
 * DTO for rescheduling an ONSITE booking.
 * Requires a new date, a new start-time slot, and a (potentially new) location.
 */
export const RescheduleOnsiteBookingRequestDtoSchema = z.object({
  bookingDate: z
    .string()
    .regex(DATE_REGEX, "Date must be in YYYY-MM-DD format"),

  startTime: z.string().regex(TIME_REGEX, "Time must be in HH:mm format"),

  location: LocationSchema,
});

export type RescheduleOnsiteBookingRequestDto = z.infer<
  typeof RescheduleOnsiteBookingRequestDtoSchema
>;
