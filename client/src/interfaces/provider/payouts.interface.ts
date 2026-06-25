export interface PayoutTransaction {
  id: string;
  amount: number;
  type: "credit" | "debit";
  category: string;
  description: string;
  bookingId: string | null;
  createdAt: string;
}

export interface ProviderPayoutsResponse {
  balance: number;
  totalEarned: number;
  pendingAmount: number;
  transactions: PayoutTransaction[];
}
