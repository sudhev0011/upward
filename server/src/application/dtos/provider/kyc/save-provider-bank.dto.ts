import { z } from "zod";

export const SaveProviderBankRequestDtoSchema = z.object({
  providerId: z.string().min(1, "Provider ID is required"),
  accountHolderName: z.string().min(2, "Account holder name is required"),
  bankName: z.string().min(2, "Bank name is required"),
  accountNumber: z.string().min(8, "Account number must be at least 8 digits"),
  ifscCode: z.string().min(4, "Invalid IFSC code"),
  branchName: z.string().min(2, "Branch name is required"),
  passbookUrl: z.string("Valid Passbook/Cheque URL is required"),
});

export type SaveProviderBankRequestDto = z.infer<typeof SaveProviderBankRequestDtoSchema>;
