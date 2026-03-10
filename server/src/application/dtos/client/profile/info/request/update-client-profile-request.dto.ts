import { z } from "zod";

export const UpdateClientProfileRequestDtoSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name must not exceed 100 characters")
    .optional(),
  userId: z.string().min(1, "User ID is required"),
  location: z
    .string()
    .max(100, "Location must not exceed 100 characters")
    .optional(),
  phone: z
    .string()
    .regex(/^\+?[\d\s\-\(\)]+$/, "Please enter a valid phone number")
    .optional(),
  email: z.string().email('Please enter a valid email address').optional(),  
});

export type UpdateClientProfileRequestDto = z.infer<
  typeof UpdateClientProfileRequestDtoSchema
>;

