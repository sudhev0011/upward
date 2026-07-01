import { z } from "zod";

export const GetAllPlansQuerySchema = z.object({
  page: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 1))
    .refine((val) => val > 0, { message: "Page must be greater than 0" }),

  limit: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 10))
    .refine((val) => val > 0, { message: "Limit must be greater than 0" }),

  search: z
    .string()
    .optional()
    .default(""),

  sort: z
    .string()
    .optional()
    .default("createdAt"),

  sortOrder: z
    .enum(["asc", "desc"])
    .optional()
    .default("desc"),
});

export type GetAllPlansRequestDto = z.infer<typeof GetAllPlansQuerySchema>;