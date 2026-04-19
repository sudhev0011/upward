export interface SubmitKycIdentityRequest {
  fullName: string;
  aadhaarNumber: string;
  dateOfBirth: string;
  address: string;
  aadhaarFrontUrl: string;
  aadhaarBackUrl: string;
}

export interface SaveKycBankRequest {
  accountHolderName: string;
  bankName: string;
  accountNumber: string;
  ifscCode: string;
  branchName: string;
  passbookUrl: string;
}

export interface UploadKycDocumentResponse {
  uploadUrl: string;
  fileUrl: string;
}

export interface ProviderKycDocument {
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

export interface providerBankDocument {
  id: string;
  providerId: string;
  accountHolderName: string;
  bankName: string;
  accountNumber: string;
  ifscCode: string;
  branchName: string;
  passbookUrl: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}
