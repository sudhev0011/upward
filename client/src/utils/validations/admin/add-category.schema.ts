import { z } from "zod";

export const categorySchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(50),
  description: z.string().min(5, "Description must be at least 5 characters").max(200),
  mode: z.enum(["onsite", "offsite", "both"]),
  isActive: z.boolean(),
});

export type CategoryFormData = z.infer<typeof categorySchema>;