import { z } from "zod";
import { PaymentType } from "../../../../../domain/enums/payment-type.enum";

const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

export const CreateOffsiteBookingRequestDtoSchema =
  z.object({
    providerServiceId: z.string().min(1),

    bookingDate: z
      .string()
      .regex(
        DATE_REGEX,
        "Date must be in YYYY-MM-DD format",
      ),

    paymentType:
      z.nativeEnum(PaymentType),

    notes: z
      .string()
      .trim()
      .max(1000)
      .nullable()
      .optional(),

    requirements: z
      .array(
        z.string()
          .trim()
          .min(1)
          .max(500),
      )
      .max(20)
      .default([]),
  });

export type CreateOffsiteBookingRequestDto =
  z.infer<
    typeof CreateOffsiteBookingRequestDtoSchema
  >;