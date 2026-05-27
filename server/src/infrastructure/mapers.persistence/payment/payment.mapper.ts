import { Types } from "mongoose";
import { Payment } from "../../../domain/entities/payment.entity";
import { PaymentDocument } from "../../persistence/mongodb/models/payment.model";

export class PaymentMapper {
  static mapToEntity(document: PaymentDocument): Payment {
    return new Payment(
      document._id.toString(),

      document.bookingId.toString(),

      document.clientId.toString(),

      document.providerId.toString(),

      document.amount,

      document.currency,

      document.transactionStatus,

      document.paymentType,

      document.stripePaymentIntentId,

      document.paidAt,

      document.createdAt,

      document.updatedAt,
    );
  }

  static mapToDocument(entity: Partial<Payment>): Partial<PaymentDocument> {
    const doc: Partial<PaymentDocument> = {};

    if (entity.bookingId !== undefined)
      doc.bookingId = new Types.ObjectId(entity.bookingId);

    if (entity.clientId !== undefined)
      doc.clientId = new Types.ObjectId(entity.clientId);

    if (entity.providerId !== undefined)
      doc.providerId = new Types.ObjectId(entity.providerId);

    if (entity.amount !== undefined) doc.amount = entity.amount;

    if (entity.currency !== undefined) doc.currency = entity.currency;

    if (entity.transactionStatus !== undefined)
      doc.transactionStatus = entity.transactionStatus;

    if (entity.paymentType !== undefined) doc.paymentType = entity.paymentType;
    if (entity.stripePaymentIntentId !== undefined)
      doc.stripePaymentIntentId = entity.stripePaymentIntentId;

    if (entity.paidAt !== undefined) doc.paidAt = entity.paidAt;

    return doc;
  }
}
