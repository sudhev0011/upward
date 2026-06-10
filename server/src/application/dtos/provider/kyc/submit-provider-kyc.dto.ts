import { z } from "zod";

export const SubmitProviderKycRequestDtoSchema = z.object({
  providerId: z.string().min(1, "Provider ID is required"),
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  aadhaarNumber: z
    .string()
    .length(12, "Aadhaar number must be exactly 12 digits"), 
  dateOfBirth: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), {
      message: "Invalid date format",
    }),
  address: z.string().min(5, "Address must be at least 5 characters"),
  aadhaarFrontUrl: z.string(),
  aadhaarBackUrl: z.string(),
});

export type SubmitProviderKycRequestDto = z.infer<
  typeof SubmitProviderKycRequestDtoSchema
>;
