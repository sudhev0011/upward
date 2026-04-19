export interface SaveProviderBankResponseDto {
  id: string;
  providerId: string;
  accountHolderName: string;
  bankName: string;
  accountNumber: string;
  ifscCode: string;
  branchName: string;
  passbookUrl: string;
  status: string;
  reason: string;
  createdAt: Date;
  updatedAt: Date;
}
