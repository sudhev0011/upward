import { z } from "zod";

const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

export const GetAvailableSlotsRequestDtoSchema =
  z.object({
    providerId: z.string().min(1),

    providerServiceId: z.string().min(1),

    date: z
      .string()
      .regex(
        DATE_REGEX,
        "Date must be in YYYY-MM-DD format"
      ),
  });

export type GetAvailableSlotsRequestDto =
  z.infer<
    typeof GetAvailableSlotsRequestDtoSchema
  >;