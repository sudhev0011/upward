import { QueryFilter, Types } from "mongoose";
import { Payment } from "../../../../domain/entities/payment.entity";
import { IPaymentRepository } from "../../../../domain/interfaces/repositories/payment/IPaymentRepository";
import { ITransactionContext } from "../../../../domain/interfaces/database/transaction-context.interface";
import { RepositoryBase } from "./base.repository";
import {
  PaymentDocument,
  PaymentModel,
} from "../../mongodb/models/payment.model";
import { PaymentMapper } from "../../../mapers.persistence/payment/payment.mapper";
import { PaymentTransactionStatus } from "../../../../domain/enums/payment-transaction-status.enum";

export class PaymentRepository
  extends RepositoryBase<Payment, PaymentDocument>
  implements IPaymentRepository
{
  constructor() {
    super(PaymentModel);
  }

  /**
   * Find by Stripe PaymentIntent ID
   */

  async findByStripePaymentIntentId(
    stripePaymentIntentId: string,
    transaction?: ITransactionContext,
  ): Promise<Payment | null> {
    return this.findOne(
      {
        stripePaymentIntentId,
      } as QueryFilter<PaymentDocument>,
      transaction,
    );
  }

  async findPendingPaymentByBookingId(
    bookingId: string,

    transaction?: ITransactionContext,
  ): Promise<Payment | null> {
    return this.findOne(
      {
        bookingId,

        transactionStatus: PaymentTransactionStatus.PENDING,
      },
      transaction,
    );
  }

  protected mapToEntity(document: PaymentDocument): Payment {
    return PaymentMapper.mapToEntity(document);
  }

  protected mapToDocument(entity: Partial<Payment>): Partial<PaymentDocument> {
    return PaymentMapper.mapToDocument(entity);
  }
}
