import { z } from "zod";

export const UpdateCategoryRequestSchema = z.object({
  id: z.string(),
  name: z.string().trim().min(1, "cannot leave name as empty").optional(),
  description: z.string().trim().min(1, "cannot leave empty description").optional(),
  mode: z.enum(["onsite", "offsite", "both"]).optional(),
  isActive: z.boolean().optional(),
});

export type UpdateCategoryRequestDto = z.infer<
  typeof UpdateCategoryRequestSchema
>;
