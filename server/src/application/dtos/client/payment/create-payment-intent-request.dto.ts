import { z } from "zod";

export const CreatePaymentIntentRequestDtoSchema =
  z.object({
    bookingId: z.string().trim().min(1),
  });

export type CreatePaymentIntentRequestDto =
  z.infer<
    typeof CreatePaymentIntentRequestDtoSchema
  >;