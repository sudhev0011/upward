import { z } from "zod";

export const GetProvidersQueryDtoSchema = z.object({
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).optional().default(10),
  search: z.string().optional(),
  isBlocked: z
    .preprocess((value) => {
      if (typeof value === "string") {
        if (value === "true") return true;
        if (value === "false") return false;
      }
      return value;
    }, z.boolean())
    .optional(),
  isApprovedByAdmin: z.coerce.boolean().optional(),
  sortBy: z.string().optional(),
  sortOrder: z.enum(["asc", "desc"]).optional().default("desc"),
});

export type GetProvidersQueryDto = z.infer<typeof GetProvidersQueryDtoSchema>;
