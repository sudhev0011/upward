import { Booking } from "../../../entities/booking.entity";
import { BookingStatus } from "../../../enums/booking-status.enum";
import { ITransactionContext } from "../../database/transaction-context.interface";
import { IBaseRepository } from "../base/IBaseRepository";

export interface IBookingRepository extends IBaseRepository<Booking> {
 
  findOverlappingActiveBooking(
    providerId: string,
    startDateTime: Date,
    endDateTime: Date,
  ): Promise<Booking | null>;
  
  findProviderBookings(providerId: string): Promise<Booking[]>;

  findCustomerBookings(customerId: string): Promise<Booking[]>;

  findByStatus(status: BookingStatus): Promise<Booking[]>;

  findExpiredPendingBookings(
    currentDate: Date,
    transaction?: ITransactionContext,
  ): Promise<Booking[]>;
}
