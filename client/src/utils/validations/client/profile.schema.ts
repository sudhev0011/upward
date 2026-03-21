import { z } from "zod";

export const profileSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be less than 50 characters")
    .regex(/^[a-zA-Z\s'-]+$/, "Name can only contain letters"),

  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("Invalid email address")
    .max(100, "Email too long")
    .optional(),

  phone: z
    .string()
    .trim()
    .regex(/^\+?[1-9]\d{7,14}$/, "Invalid phone number format")
    .nullable()
    .optional(),

  location: z
    .string()
    .trim()
    .min(2, "Location too short")
    .max(100, "Location too long")
    .nullable()
    .optional(),
});

export type ProfileFormData = z.infer<typeof profileSchema>;    