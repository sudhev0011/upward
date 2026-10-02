export interface AdminPayoutRequestItem {
  payoutRequest: {
    id: string;
    providerId: string;
    amount: number;
    status: "pending" | "transferred" | "rejected";
    adminNotes?: string;
    createdAt: string;
    updatedAt: string;
  };
  provider: {
    name: string;
    email: string;
  };
  bankDetails: {
    id: string;
    providerId: string;
    accountHolderName: string;
    bankName: string;
    accountNumber: string;
    ifscCode: string;
    branchName: string;
    passbookUrl: string;
    status: "pending" | "approved" | "rejected";
    reason?: string;
    createdAt: string;
    updatedAt: string;
  } | null;
}

export interface AdminPayoutRequestsResponse {
  data: AdminPayoutRequestItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
