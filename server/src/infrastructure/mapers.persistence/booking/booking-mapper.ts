import { Types } from "mongoose";
import { Booking } from "../../../domain/entities/booking.entity";
import { BookingDocument } from "../../persistence/mongodb/models/booking.model";

export class BookingMapper {
  static mapToEntity(document: BookingDocument): Booking {
    return Booking.create({
      id: document._id.toString(),

      clientId: document.clientId.toString(),

      providerId: document.providerId.toString(),

      providerServiceId: document.providerServiceId.toString(),

      serviceId: document.serviceId.toString(),

      status: document.status,

      paymentType: document.paymentType,

      paymentStatus: document.paymentStatus,

      totalAmount: document.totalAmount,

      paidAmount: document.paidAmount,

      bookingDate: document.bookingDate,

      startDateTime: document.startDateTime,

      endDateTime: document.endDateTime,

      notes: document.notes,

      refundAmount: document.refundAmount,

      cancelledBy: document.cancelledBy?.toString() || null,

      cancellationReason: document.cancellationReason,

      cancelledAt: document.cancelledAt,

      expiresAt: document.expiresAt,

      createdAt: document.createdAt,

      updatedAt: document.updatedAt,
    });
  }

  static mapToDocument(entity: Partial<Booking>): Partial<BookingDocument> {
    const doc: Partial<BookingDocument> = {};

    if (entity.clientId !== undefined)
      doc.clientId = new Types.ObjectId(entity.clientId);
    if (entity.providerId !== undefined)
      doc.providerId = new Types.ObjectId(entity.providerId);

    if (entity.providerServiceId !== undefined)
      doc.providerServiceId = new Types.ObjectId(entity.providerServiceId);

    if (entity.serviceId !== undefined)
      doc.serviceId = new Types.ObjectId(entity.serviceId);

    if (entity.status !== undefined) doc.status = entity.status;
    if (entity.paymentType !== undefined) doc.paymentType = entity.paymentType;
    if (entity.totalAmount !== undefined) doc.totalAmount = entity.totalAmount;
    if (entity.paidAmount !== undefined) doc.paidAmount = entity.paidAmount;
    if (entity.remainingAmount !== undefined)
      doc.remainingAmount = entity.remainingAmount;

    if (entity.refundAmount !== undefined)
      doc.refundAmount = entity.refundAmount;

    if (entity.bookingDate !== undefined) doc.bookingDate = entity.bookingDate;

    if (entity.startDateTime !== undefined)
      doc.startDateTime = entity.startDateTime;

    if (entity.endDateTime !== undefined) doc.endDateTime = entity.endDateTime;

    if (entity.notes !== undefined) doc.notes = entity.notes;

    if (entity.cancelledBy !== undefined)
      doc.cancelledBy =
        entity.cancelledBy == null
          ? null
          : new Types.ObjectId(entity.cancelledBy);

    if (entity.cancellationReason !== undefined)
      doc.cancellationReason = entity.cancellationReason;

    if (entity.cancelledAt !== undefined) doc.cancelledAt = entity.cancelledAt;

    if (entity.expiresAt !== undefined) doc.expiresAt = entity.expiresAt;

    return doc;
  }
}
