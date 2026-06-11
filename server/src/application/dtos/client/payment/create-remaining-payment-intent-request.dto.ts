import { z } from "zod";

export const CreateRemainingPaymentIntentRequestDtoSchema = z.object({
  bookingId: z.string().min(1),
});

export type CreateRemainingPaymentIntentRequestDto = z.infer<
  typeof CreateRemainingPaymentIntentRequestDtoSchema
>;
