import { Booking } from "../../../domain/entities/booking.entity";
import { BookingStatus } from "../../../domain/enums/booking-status.enum";
import { BookingMode } from "../../../domain/enums/bookingMode.enum";
import { PaymentType } from "../../../domain/enums/payment-type.enum";
import { UnavailabilitySource } from "../../../domain/enums/unavailability.enum";
import { ITransactionManager } from "../../../domain/interfaces/database/transaction-manager.interface";
import { IBookingRepository } from "../../../domain/interfaces/repositories/booking/IBookingRepository";
import { IUnavailabilityRepository } from "../../../domain/interfaces/repositories/unavailability/IUnavaliability-repository";
import { IBookingIdGenerator } from "../../../domain/interfaces/services/IBookingNumberGenerator";
import { ICreateBookingUseCase } from "../../../domain/interfaces/usecases/booking/ICreateBookingUseCase";
import { CreateBookingRequestDto } from "../../dtos/client/booking/request/create-booking-request.dto";
import { CreateBookingResponseDto } from "../../dtos/client/booking/response/create-booking-response.dto";
import { BookingTravelValidationService } from "../../services/booking-travel-validation.service";
import { SlotValidationService } from "../../services/slot-validation.service";
export const PLATFORM_ADVANCE_PERCENTAGE = 20;

export const BOOKING_PENDING_EXPIRY_MINUTES = 10;

export class CreateBookingUseCase implements ICreateBookingUseCase {
  constructor(
    private bookingRepository: IBookingRepository,

    private unavailabilityRepository: IUnavailabilityRepository,

    private slotValidationService: SlotValidationService,

    private bookingTravelValidationService: BookingTravelValidationService,

    private transactionManager: ITransactionManager,

    private bookingIdGenerator: IBookingIdGenerator,
  ) {}

  async execute(
    clientId: string,
    data: CreateBookingRequestDto,
  ): Promise<CreateBookingResponseDto> {
    /**
     * STEP 1
     * Validate requested slot
     */

    const validationResult = await this.slotValidationService.validate({
      providerServiceId: data.providerServiceId,

      bookingDate: data.bookingDate,

      startTime: data.startTime,
    });

    /**
     * STEP 2
     * Validate booking travel feasibility
     */

    await this.bookingTravelValidationService.validate({
      providerId: validationResult.providerId,

      bookingLocation: data.location,
      bookingDate: data.bookingDate,
      startDateTime: validationResult.startDateTime,

      endDateTime: validationResult.endDateTime,
    });

    /**
     * STEP 2
     * Calculate payment amounts
     */

    const totalAmount = validationResult.totalAmount;

    const paidAmount =
      data.paymentType === PaymentType.FULL
        ? totalAmount
        : (totalAmount * PLATFORM_ADVANCE_PERCENTAGE) / 100;

    /**
     * STEP 3
     * Create booking expiry
     */

    const expiresAt = new Date(
      Date.now() + BOOKING_PENDING_EXPIRY_MINUTES * 60 * 1000,
    );

    /**
     * STEP 4
     * Create pending booking entity
     */

    const bookingId = await this.bookingIdGenerator.generate();

    const booking = Booking.create({
      clientId,

      bookingId,

      providerId: validationResult.providerId,

      providerServiceId: data.providerServiceId,

      serviceId: validationResult.serviceId,

      status: BookingStatus.PENDING,

      paymentType: data.paymentType,

      totalAmount,

      paidAmount,

      bookingDate: data.bookingDate,

      bookingMode: BookingMode.ONSITE,

      startDateTime: validationResult.startDateTime,

      endDateTime: validationResult.endDateTime,

      location: data.location,

      notes: data.notes ?? null,

      requirements: data.requirements,

      expiresAt,
    });

    /**
     * STEP 5
     * TRANSACTIONAL FLOW
     */

    return this.transactionManager.runInTransaction(async (transaction) => {
      /**
       * Persist booking
       */

      const createdBooking = await this.bookingRepository.create(
        booking,
        transaction,
      );

      /**
       * Create occupancy
       */

      await this.unavailabilityRepository.create(
        {
          providerId: validationResult.providerId,

          startDate: validationResult.startDateTime,

          endDate: validationResult.endDateTime,

          source: UnavailabilitySource.BOOKING,

          bookingId: createdBooking.id!,

          reason: null,
        },
        transaction,
      );

      /**
       * Return response
       */

      return {
        id: createdBooking.id!,
        
        bookingId: createdBooking.bookingId,

        status: createdBooking.status,

        paymentType: createdBooking.paymentType,

        paymentStatus: createdBooking.paymentStatus,

        totalAmount: createdBooking.totalAmount,

        paidAmount: createdBooking.paidAmount,

        remainingAmount: createdBooking.remainingAmount,

        location: createdBooking.location,

        expiresAt: createdBooking.expiresAt,
      };
    });
  }
}
