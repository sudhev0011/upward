import { Booking } from "../../../domain/entities/booking.entity";
import { BookingStatus } from "../../../domain/enums/booking-status.enum";
import { PaymentStatus } from "../../../domain/enums/payment-status.enum";
import { PaymentType } from "../../../domain/enums/payment-type.enum";
import { UnavailabilitySource } from "../../../domain/enums/unavailability.enum";
import { ITransactionManager } from "../../../domain/interfaces/database/transaction-manager.interface";
import { IBookingRepository } from "../../../domain/interfaces/repositories/booking/IBookingRepository";
import { IUnavailabilityRepository } from "../../../domain/interfaces/repositories/unavailability/IUnavaliability-repository";
import { ICreateBookingUseCase } from "../../../domain/interfaces/usecases/booking/ICreateBookingUseCase";
import { CreateBookingRequestDto } from "../../dtos/client/booking/create-booking-request.dto";
import { CreateBookingResponseDto } from "../../dtos/client/booking/create-booking-response.dto";
import { SlotValidationService } from "../../services/slot-validation.service";

export const PLATFORM_ADVANCE_PERCENTAGE = 20;

export const BOOKING_PENDING_EXPIRY_MINUTES = 10;

export class CreateBookingUseCase
  implements ICreateBookingUseCase
{
  constructor(
    private bookingRepository: IBookingRepository,

    private unavailabilityRepository: IUnavailabilityRepository,

    private slotValidationService: SlotValidationService,

    private transactionManager: ITransactionManager,
  ) {}

  async execute(
  clientId: string,
  data: CreateBookingRequestDto
): Promise<CreateBookingResponseDto> {

  /**
   * STEP 1
   * Validate requested slot
   */

  const validationResult =
    await this.slotValidationService.validate({
      providerServiceId:
        data.providerServiceId,

      bookingDate:
        data.bookingDate,

      startTime:
        data.startTime,
    });

  /**
   * STEP 2
   * Calculate payment amounts
   */

  const totalAmount =
    validationResult.totalAmount;

  let paidAmount = 0;

  if (
    data.paymentType ===
    PaymentType.FULL
  ) {
    paidAmount = totalAmount;
  } else {
    paidAmount =
      (totalAmount *
        PLATFORM_ADVANCE_PERCENTAGE) /
      100;
  }

  /**
   * STEP 3
   * Create booking expiry
   */

  const expiresAt = new Date(
    Date.now() +
      BOOKING_PENDING_EXPIRY_MINUTES *
        60 *
        1000
  );

  /**
   * STEP 4
   * Create pending booking entity
   */

  const booking = Booking.create({
    clientId,

    providerId:
      validationResult.providerId,

    providerServiceId:
      data.providerServiceId,

    serviceId:
      validationResult.serviceId,

    status: BookingStatus.PENDING,

    paymentType:
      data.paymentType,

    paymentStatus:
      paidAmount === totalAmount
        ? PaymentStatus.PAID
        : PaymentStatus.PARTIALLY_PAID,

    totalAmount,

    paidAmount,

    bookingDate:
      data.bookingDate,

    startDateTime:
      validationResult.startDateTime,

    endDateTime:
      validationResult.endDateTime,

    notes:
      data.notes ?? null,

    expiresAt,
  });

  /**
   * STEP 5
   * TRANSACTIONAL FLOW
   */

  return this.transactionManager.runInTransaction(
    async (transaction) => {

      /**
       * Persist booking
       */

      const createdBooking =
        await this.bookingRepository.create(
          booking,
          transaction
        );

      /**
       * Create occupancy
       */

      await this.unavailabilityRepository.create(
        {
          providerId:
            validationResult.providerId,

          startDate:
            validationResult.startDateTime,

          endDate:
            validationResult.endDateTime,

          source:
            UnavailabilitySource.BOOKING,

          bookingId:
            createdBooking.id!,

          reason: null,
        },
        transaction
      );

      /**
       * Return response
       */

      return {
        bookingId:
          createdBooking.id!,

        status:
          createdBooking.status,

        paymentType:
          createdBooking.paymentType,

        paymentStatus:
          createdBooking.paymentStatus,

        totalAmount:
          createdBooking.totalAmount,

        paidAmount:
          createdBooking.paidAmount,

        remainingAmount:
          createdBooking.remainingAmount,

        expiresAt:
          createdBooking.expiresAt,
      };
    }
  );
}
}