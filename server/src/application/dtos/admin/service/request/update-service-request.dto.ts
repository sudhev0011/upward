import z from "zod";

export const UpdateServiceRequestDtoSchema = z.object({
  id: z.string(),
  categoryId: z.string(),
  name: z.string().trim().min(1, "name required for service").optional(),
  description: z.string().trim().min(1, "description required").optional(),
  maxHour: z.number().nullable().optional(),
  mode: z.enum(["onsite", "offsite", "both"]).optional(),
  isActive: z.boolean().optional(),
});

export type UpdateServiceRequestDto = z.infer<
  typeof UpdateServiceRequestDtoSchema
>;
