import { z } from "zod";

const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

/**
 * DTO for rescheduling an OFFSITE booking.
 * Only requires a new date — no start time or location (offsite bookings have neither).
 */
export const RescheduleOffsiteBookingRequestDtoSchema = z.object({
  bookingDate: z
    .string()
    .regex(DATE_REGEX, "Date must be in YYYY-MM-DD format"),
});

export type RescheduleOffsiteBookingRequestDto = z.infer<
  typeof RescheduleOffsiteBookingRequestDtoSchema
>;
