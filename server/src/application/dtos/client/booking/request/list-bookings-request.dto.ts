import { z } from "zod";

import { BookingStatus } from "../../../../../domain/enums/booking-status.enum";

import { PaymentStatus } from "../../../../../domain/enums/payment-status.enum";

const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

export const ListBookingsRequestDtoSchema = z.object({
  page: z.coerce.number().int().positive().optional().default(1),

  limit: z.coerce.number().int().positive().optional().default(10),

  search: z.string().trim().optional(),

  sortOrder: z.enum(["asc", "desc"]).optional().default("desc"),

  status: z
    .union([
      z.nativeEnum(BookingStatus),

      z.array(z.nativeEnum(BookingStatus)),
    ])
    .optional()
    .transform((value) => {
      if (!value) return undefined;

      return Array.isArray(value) ? value : [value];
    }),

  paymentStatus: z
    .union([
      z.nativeEnum(PaymentStatus),

      z.array(z.nativeEnum(PaymentStatus)),
    ])
    .optional()
    .transform((value) => {
      if (!value) return undefined;

      return Array.isArray(value) ? value : [value];
    }),

  fromDate: z.string().regex(DATE_REGEX).optional(),

  toDate: z.string().regex(DATE_REGEX).optional(),
}).refine(
  (data) => {
    if (data.fromDate && data.toDate) {
      return data.fromDate <= data.toDate;
    }

    return true;
  },
  {
    message: "fromDate cannot be greater than toDate",
    path: ["fromDate"],
  },
);