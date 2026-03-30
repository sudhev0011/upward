import * as z from "zod";

export const kycIdentitySchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  aadhaarNumber: z.string().length(12, "Aadhaar must be exactly 12 digits"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  address: z.string().min(5, "Address is required"),
});

export const kycBankSchema = z.object({
  accountHolderName: z.string().min(2, "Account holder name is required"),
  bankName: z.string().min(2, "Bank name is required"),
  accountNumber: z.string().min(8, "Account number must be at least 8 digits"),
  confirmAccountNumber: z.string().min(8, "Confirm account number is required"),
  ifscCode: z.string().min(4, "IFSC code is required"),
  branchName: z.string().min(2, "Branch name is required"),
}).refine(data => data.accountNumber === data.confirmAccountNumber, {
  message: "Account numbers don't match",
  path: ["confirmAccountNumber"]
});

export type KycIdentityFormValues = z.infer<typeof kycIdentitySchema>;
export type KycBankFormValues = z.infer<typeof kycBankSchema>;
