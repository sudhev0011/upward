import { Booking } from "../../../../domain/entities/booking.entity";
import { BookingStatus } from "../../../../domain/enums/booking-status.enum";
import { IBookingRepository } from "../../../../domain/interfaces/repositories/booking/IBookingRepository";
import { BookingDocument, BookingModel } from "../models/booking.model";
import { RepositoryBase } from "./base.repository";
import { ITransactionContext } from "../../../../domain/interfaces/database/transaction-context.interface";
import { MongoSessionUtil } from "../helper/mongo-session.utils";

export class BookingRepository
  extends RepositoryBase<Booking, BookingDocument>
  implements IBookingRepository
{
  constructor() {
    super(BookingModel);
  }

  async findOverlappingActiveBooking(
    providerId: string,
    startDateTime: Date,
    endDateTime: Date,
    transaction?: ITransactionContext,
  ): Promise<Booking | null> {
    const session = MongoSessionUtil.getSession(transaction);
    return this.findOne(
      {
        providerId,

        status: {
          $in: [
            BookingStatus.PENDING,
            BookingStatus.CONFIRMED,
            BookingStatus.COMPLETED,
          ],
        },

        startDateTime: {
          $lt: endDateTime,
        },

        endDateTime: {
          $gt: startDateTime,
        },
      },
      session,
    );
  }

  async findExpiredPendingBookings(
    currentDate: Date,
    transaction?: ITransactionContext,
  ): Promise<Booking[]> {
    const session = MongoSessionUtil.getSession(transaction);
    return this.findMany(
      {
        status: BookingStatus.PENDING,

        expiresAt: {
          $lte: currentDate,
        },
      },
      session,
    );
  }

  async findProviderBookings(
    providerId: string,
    transaction?: ITransactionContext,
  ): Promise<Booking[]> {
    const session = MongoSessionUtil.getSession(transaction);
    return this.findMany(
      {
        providerId,
      },
      session,
    );
  }

  async findCustomerBookings(clientId: string): Promise<Booking[]> {
    return this.findMany({
      clientId,
    });
  }

  async findByStatus(status: BookingStatus): Promise<Booking[]> {
    return this.findMany({
      status,
    });
  }

  protected mapToEntity(document: BookingDocument): Booking {
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

  protected mapToDocument(entity: Partial<Booking>): Partial<BookingDocument> {
    return {
      clientId: entity.clientId as any,

      providerId: entity.providerId as any,

      providerServiceId: entity.providerServiceId as any,

      serviceId: entity.serviceId as any,

      status: entity.status,

      paymentType: entity.paymentType,

      paymentStatus: entity.paymentStatus,

      totalAmount: entity.totalAmount,

      paidAmount: entity.paidAmount,

      remainingAmount: entity.remainingAmount,

      refundAmount: entity.refundAmount,

      bookingDate: entity.bookingDate,

      startDateTime: entity.startDateTime,

      endDateTime: entity.endDateTime,

      notes: entity.notes,

      cancelledBy: entity.cancelledBy as any,

      cancellationReason: entity.cancellationReason,

      cancelledAt: entity.cancelledAt,

      expiresAt: entity.expiresAt,
    };
  }
}
