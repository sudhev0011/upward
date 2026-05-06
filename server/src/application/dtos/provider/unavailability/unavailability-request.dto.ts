import { z } from "zod";
import { UnavailabilitySource } from "../../../../domain/enums/unavailability.enum";

export const BaseCreateUnavailabilitySchema = z.object({
  providerId: z.string(),
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
  reason: z.string().trim().nullable().default(null),
  source: z.nativeEnum(UnavailabilitySource),
  bookingId: z.string().nullable().default(null),
});

export const CreateUnavailabilityRequestDtoSchema =
  BaseCreateUnavailabilitySchema.refine(
    (data) => data.startDate < data.endDate,
    {
      message: "startDate must be before endDate",
      path: ["endDate"],
    },
  ).refine(
    (data) =>
      data.source === UnavailabilitySource.BOOKING ? !!data.bookingId : true,
    {
      message: "bookingId is required when source is booking",
      path: ["bookingId"],
    },
  );

export type CreateUnavailabilityRequestDto = z.infer<
  typeof CreateUnavailabilityRequestDtoSchema
>;

export const UpdateUnavailabilityRequestDtoSchema = z
  .object({
    startDate: z.coerce.date().optional(),
    endDate: z.coerce.date().optional(),
    reason: z.string().trim().nullable().optional(),
  })
  .refine(
    (data) => {
      if (data.startDate && data.endDate) return data.startDate < data.endDate;
      return true;
    },
    {
      message: "startDate must be before endDate",
      path: ["endDate"],
    },
  );

export type UpdateUnavailabilityRequestDto = z.infer<
  typeof UpdateUnavailabilityRequestDtoSchema
>;
