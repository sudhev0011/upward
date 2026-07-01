import z from 'zod'

const GeoPointSchema = z.object({
  type: z.literal("Point"),

  coordinates: z
    .tuple([
      z.number(),
      z.number(),
    ])
    .refine(
      ([lng, lat]) => {
        return (
          lng >= -180 &&
          lng <= 180 &&
          lat >= -90 &&
          lat <= 90
        );
      },
      {
        error: "Invalid coordinates",
      },
    ),
});

export const LocationSchema = z.object({
  placeId: z
    .string()
    .trim()
    .min(1, "Place ID is required"),

  address: z
    .string()
    .trim()
    .min(3, "Enter a valid address")
    .max(255, "Address is too long"),

  city: z
    .string()
    .trim()
    .max(100)
    .optional()
    .nullable(),

  state: z
    .string()
    .trim()
    .max(100)
    .optional()
    .nullable(),

  country: z
    .string()
    .trim()
    .max(100)
    .optional()
    .nullable(),

  coordinates: GeoPointSchema,
});

export type Location = z.infer<typeof LocationSchema>;