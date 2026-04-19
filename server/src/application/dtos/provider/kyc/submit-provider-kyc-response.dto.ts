export interface SubmitProviderKycResponseDto {
  id: string;
  providerId: string;
  fullName: string;
  aadhaarNumber: string;
  dateOfBirth: string;
  address: string;
  aadhaarFrontUrl: string;
  aadhaarBackUrl: string;
  status: string;
  reason: string;
  createdAt: Date;
  updatedAt: Date;
}