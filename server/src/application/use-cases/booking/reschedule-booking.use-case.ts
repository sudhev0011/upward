import { BookingMode } from "../../../domain/enums/bookingMode.enum";
import {
  AuthorizationError,
  NotFoundError,
  ValidationError,
} from "../../../domain/errors/errors";
import { ITransactionManager } from "../../../domain/interfaces/database/transaction-manager.interface";
import { IBookingRepository } from "../../../domain/interfaces/repositories/booking/IBookingRepository";
import { IUnavailabilityRepository } from "../../../domain/interfaces/repositories/unavailability/IUnavaliability-repository";
import { IRescheduleBookingUseCase } from "../../../domain/interfaces/usecases/booking/IRescheduleBookingUseCase";
import { UnavailabilitySource } from "../../../domain/enums/unavailability.enum";
import { SlotValidationService } from "../../services/slot-validation.service";
import { BookingTravelValidationService } from "../../services/booking-travel-validation.service";
import { Location } from "../../../domain/interfaces/location.interface";

export class RescheduleBookingUseCase implements IRescheduleBookingUseCase {
  constructor(
    private readonly bookingRepository: IBookingRepository,

    private readonly unavailabilityRepository: IUnavailabilityRepository,

    private readonly slotValidationService: SlotValidationService,

    private readonly bookingTravelValidationService: BookingTravelValidationService,

    private readonly transactionManager: ITransactionManager,
  ) {}

  async execute(params: {
    bookingId: string;
    clientId: string;
    newBookingDate: string;
    newStartTime: string | null;
    newLocation: Location | null;
  }): Promise<void> {
    const { bookingId, clientId, newBookingDate, newStartTime, newLocation } =
      params;

    /**
     * STEP 1
     * Fetch booking and authorise
     */

    const booking = await this.bookingRepository.findById(bookingId);

    if (!booking) {
      throw new NotFoundError("Booking not found");
    }

    if (booking.clientId !== clientId) {
      throw new AuthorizationError("Not authorized to reschedule this booking");
    }

    /**
     * STEP 2
     * Validate slot & travel feasibility (onsite only)
     */

    let newStartDateTime: Date | null = null;
    let newEndDateTime: Date | null = null;

    if (booking.bookingMode === BookingMode.ONSITE) {
      /**
       * startTime and location are mandatory for onsite
       */

      if (!newStartTime || !newLocation) {
        throw new ValidationError(
          "Start time and location are required for onsite rescheduling",
        );
      }

      const validationResult = await this.slotValidationService.validate({
        providerServiceId: booking.providerServiceId,
        bookingDate: newBookingDate,
        startTime: newStartTime,
      });

      newStartDateTime = validationResult.startDateTime;
      newEndDateTime = validationResult.endDateTime;

      await this.bookingTravelValidationService.validate({
        providerId: booking.providerId,
        bookingLocation: newLocation,
        bookingDate: newBookingDate,
        startDateTime: newStartDateTime,
        endDateTime: newEndDateTime,
      });
    }

    /**
     * STEP 3
     * Apply domain reschedule rule (validates 7-day window + CONFIRMED status)
     */

    const rescheduledBooking = booking.reschedule({
      newBookingDate,
      newStartDateTime,
      newEndDateTime,
    });

    /**
     * STEP 4
     * Persist atomically:
     * - Delete old unavailability (onsite only)
     * - Update booking
     * - Create new unavailability (onsite only)
     */

    await this.transactionManager.runInTransaction(async (transaction) => {
      if (booking.bookingMode === BookingMode.ONSITE) {
        await this.unavailabilityRepository.deleteByBookingId(
          bookingId,
          transaction,
        );
      }

      await this.bookingRepository.update(
        bookingId,
        rescheduledBooking,
        transaction,
      );

      if (
        booking.bookingMode === BookingMode.ONSITE &&
        newStartDateTime &&
        newEndDateTime
      ) {
        await this.unavailabilityRepository.create(
          {
            providerId: booking.providerId,
            startDate: newStartDateTime,
            endDate: newEndDateTime,
            source: UnavailabilitySource.BOOKING,
            bookingId,
            reason: null,
          },
          transaction,
        );
      }
    });
  }
}
