export interface AdminPaymentRecord {
  id: string;
  transactionId: string;
  clientId: string;
  clientName: string;
  clientEmail: string;
  providerId: string;
  providerName: string;
  providerEmail: string;
  bookingId: string;
  amount: number;
  currency: string;
  transactionStatus: string;
  paymentType: string;
  paidAt: string | null;
  createdAt: string;
}

export interface AdminPaymentsResponse {
  data: AdminPaymentRecord[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
