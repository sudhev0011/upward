import { ITransactionManager } from "../../../domain/interfaces/database/transaction-manager.interface";
import { IBookingRepository } from "../../../domain/interfaces/repositories/booking/IBookingRepository";
import { IUnavailabilityRepository } from "../../../domain/interfaces/repositories/unavailability/IUnavaliability-repository";
import { IExpirePendingBookingsUseCase } from "../../../domain/interfaces/usecases/booking/IExpirePendingBookingsUseCase";

export class ExpirePendingBookingsUseCase
  implements IExpirePendingBookingsUseCase
{
  constructor(
    private bookingRepository: IBookingRepository,

    private unavailabilityRepository: IUnavailabilityRepository,

    private transactionManager: ITransactionManager
  ) {}

  async execute(): Promise<void> {

    /**
     * STEP 1
     * Find expired pending bookings
     */

    const expiredBookings =
      await this.bookingRepository.findExpiredPendingBookings(
        new Date()
      );

    /**
     * STEP 2
     * Process each booking
     */

    for (const booking of expiredBookings) {

      await this.transactionManager.runInTransaction(
        async (transaction) => {

          /**
           * Mark booking expired
           */

          const expiredBooking =
            booking.expire();

          await this.bookingRepository.update(
            booking.id!,
            expiredBooking,
            transaction
          );

          /**
           * Remove occupancy
           */

          await this.unavailabilityRepository.deleteByBookingId(
            booking.id!,
            transaction
          );
        }
      );
    }
  }
}