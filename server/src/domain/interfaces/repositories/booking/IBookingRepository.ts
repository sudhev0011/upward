import { Booking } from "../../../entities/booking.entity";
import { BookingStatus } from "../../../enums/booking-status.enum";
import { IBaseRepository } from "../base/IBaseRepository";

export interface IBookingRepository extends IBaseRepository<Booking> {
  /**
   * Active occupancy overlap check
   */
  findOverlappingActiveBooking(
    providerId: string,
    startDateTime: Date,
    endDateTime: Date
  ): Promise<Booking | null>;

  /**
   * Find expired pending bookings
   */
  findExpiredPendingBookings(
    currentDate: Date
  ): Promise<Booking[]>;

  /**
   * Provider bookings
   */
  findProviderBookings(
    providerId: string
  ): Promise<Booking[]>;

  /**
   * Customer bookings
   */
  findCustomerBookings(
    customerId: string
  ): Promise<Booking[]>;

  /**
   * Status filtering
   */
  findByStatus(
    status: BookingStatus
  ): Promise<Booking[]>;
}