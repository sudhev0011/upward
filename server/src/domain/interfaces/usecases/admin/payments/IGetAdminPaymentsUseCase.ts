export interface AdminPaymentsResponse {
  data: Array<{
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
    paidAt: Date | null;
    createdAt: Date;
  }>;
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface IGetAdminPaymentsUseCase {
  execute(options: {
    page?: number;
    limit?: number;
    search?: string;
    transactionStatus?: string;
  }): Promise<AdminPaymentsResponse>;
}
