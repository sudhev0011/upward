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
  dateOfBirth: z.string().date("Please enter a valid date of birth").optional(),
  gender: z.string().max(50, "Gender must not exceed 50 characters").optional(),
});

export type UpdateClientProfileRequestDto = z.infer<
  typeof UpdateClientProfileRequestDtoSchema
>;

export const UpdateClientProfileDto = UpdateClientProfileRequestDtoSchema;
