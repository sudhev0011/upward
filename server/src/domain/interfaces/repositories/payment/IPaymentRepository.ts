import { ITransactionContext } from "../../database/transaction-context.interface";

import { Payment } from "../../../entities/payment.entity";
import { IBaseRepository } from "../base/IBaseRepository";

export interface IPaymentRepository extends IBaseRepository<Payment> {
  findByStripePaymentIntentId(
    stripePaymentIntentId: string,
    transaction?: ITransactionContext,
  ): Promise<Payment | null>;

  findPendingPaymentByBookingId(
    bookingId: string,
    transaction?: ITransactionContext,
  ): Promise<Payment | null>;

  getPaymentsWithDetails(options: {
    page?: number;
    limit?: number;
    search?: string;
    transactionStatus?: string;
  }): Promise<{
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
  }>;
}
