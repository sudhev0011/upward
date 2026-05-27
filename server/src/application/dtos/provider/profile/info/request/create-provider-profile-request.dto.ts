import { z } from "zod";
import { LocationSchema } from "../../../../common/location/location.dto";

const SocialLinkSchema = z.object({
  name: z.string().min(1, "Social link name is required"),

  link: z.string().url("Please enter a valid URL"),
});


export const CreateProviderProfileRequestDtoSchema =
  z.object({
    userId: z
      .string()
      .min(1, "User ID is required"),

    bio: z
      .string()
      .max(
        2000,
        "Summary must not exceed 2000 characters",
      )
      .optional(),

    location: LocationSchema.optional(),

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
      )
      .optional(),

    dateOfBirth: z.coerce
      .date()
      .optional(),

    gender: z
      .string()
      .max(
        50,
        "Gender must not exceed 50 characters",
      )
      .optional(),

    skills: z.array(z.string()).default([]),

    languages: z.array(z.string()).default([]),

    experience: z
      .string()
      .min(
        0,
        "cannot have negative experience",
      )
      .optional(),

    ratingCount: z
      .number()
      .min(0, "cannot be negative")
      .optional(),

    ratingAvg: z
      .number()
      .min(0)
      .max(5)
      .optional(),

    isApprovedByAdmin: z
      .boolean()
      .optional(),

    socialLinks: z
      .array(SocialLinkSchema)
      .default([]),
  });

export type CreateProviderProfileRequestDto =
  z.infer<
    typeof CreateProviderProfileRequestDtoSchema
  >;