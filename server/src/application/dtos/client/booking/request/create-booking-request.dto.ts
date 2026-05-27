import { z } from "zod";

import { PaymentType } from "../../../../../domain/enums/payment-type.enum";
import { LocationSchema } from "../../../common/location/location.dto";

const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

const TIME_REGEX = /^([01]\d|2[0-3]):([0-5]\d)$/;

export const CreateBookingRequestDtoSchema = z.object({
  providerServiceId: z.string().min(1),

  bookingDate: z
    .string()
    .regex(DATE_REGEX, "Date must be in YYYY-MM-DD format"),

  startTime: z.string().regex(TIME_REGEX, "Time must be in HH:mm format"),

  paymentType: z.nativeEnum(PaymentType),

  location: LocationSchema,
  notes: z.string().trim().nullable().optional(),
});

export type CreateBookingRequestDto = z.infer<
  typeof CreateBookingRequestDtoSchema
>;
