import { z } from "zod";

const socialLinkSchema = z.object({
  name: z.string().min(1, "Social link name is required"),

  link: z
    .union([
      z.string().url("Please enter a valid URL"),
      z.literal(""),
    ])
    .optional(),
});

const geoPointSchema = z.object({
  type: z.literal("Point"),

  coordinates: z.tuple([
    z.number(), // lng
    z.number(), // lat
  ]),
});

const locationSchema = z.object({
  placeId: z.string(),

  address: z.string(),

  city: z.string().nullable().optional(),

  state: z.string().nullable().optional(),

  country: z.string().nullable().optional(),

  coordinates: geoPointSchema,
});

export const providerProfileSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "Name is required")
    .max(100, "Name must not exceed 100 characters")
    .optional(),

  bio: z
    .string()
    .max(
      2000,
      "Summary must not exceed 2000 characters",
    )
    .optional(),

  location: locationSchema.optional(),

  phone: z
    .string()
    .regex(
      /^\+?[\d\s\-\(\)]+$/,
      "Please enter a valid phone number",
    )
    .optional(),

  email: z
    .string()
    .email(
      "Please enter a valid email address",
    ),

  dateOfBirth: z
    .string()
    .date("Please enter a valid date of birth")
    .optional(),

  gender: z
    .string()
    .max(
      50,
      "Gender must not exceed 50 characters",
    )
    .optional(),

  skills: z.array(z.string()).optional(),

  languages: z.array(z.string()).optional(),

  experience: z
    .string()
    .regex(
      /^\d+$/,
      "Must be a positive number",
    )
    .optional(),

  socialLinks: z
    .array(socialLinkSchema)
    .optional(),
});

export type ProviderProfileFormData =
  z.infer<typeof providerProfileSchema>;