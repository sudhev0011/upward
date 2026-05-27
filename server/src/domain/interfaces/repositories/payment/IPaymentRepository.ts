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
}
