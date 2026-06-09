import { z } from "zod";

export const CancelBookingRequestDtoSchema = z.object({
  reason: z.string().trim().max(500).nullable().optional(),
});

export type CancelBookingRequestDto = z.infer<
  typeof CancelBookingRequestDtoSchema
>;
