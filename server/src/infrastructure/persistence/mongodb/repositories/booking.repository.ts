import { Booking } from "../../../../domain/entities/booking.entity";
import { BookingStatus } from "../../../../domain/enums/booking-status.enum";
import { IBookingRepository } from "../../../../domain/interfaces/repositories/booking/IBookingRepository";
import { BookingDocument, BookingModel } from "../models/booking.model";
import { RepositoryBase } from "./base.repository";
import { ITransactionContext } from "../../../../domain/interfaces/database/transaction-context.interface";
import { MongoSessionUtil } from "../helper/mongo-session.utils";
import { BookingMapper } from "../../../mapers.persistence/booking/booking-mapper";
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

  async findPendingBookingByIdAndClientId(
    bookingId: string,

    clientId: string,

    transaction?: ITransactionContext,
  ): Promise<Booking | null> {
    return this.findOne(
      {
        _id: bookingId,

        clientId,

        status: BookingStatus.PENDING,
      },
      transaction,
    );
  }

  protected mapToEntity(document: BookingDocument): Booking {
    return BookingMapper.mapToEntity(document);
  }

  protected mapToDocument(entity: Partial<Booking>): Partial<BookingDocument> {
    return BookingMapper.mapToDocument(entity);
  }
}
