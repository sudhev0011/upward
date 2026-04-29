import { z } from "zod";

export const UpdateCategoryRequestSchema = z.object({
  id: z.string(),
  isActive: z.boolean(),
});

export type UpdateCategoryRequestDto = z.infer<
  typeof UpdateCategoryRequestSchema
>;
