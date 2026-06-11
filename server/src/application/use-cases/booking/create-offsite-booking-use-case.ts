import { Booking } from "../../../domain/entities/booking.entity";
import { BookingStatus } from "../../../domain/enums/booking-status.enum";
import { BookingMode } from "../../../domain/enums/bookingMode.enum";
import { PaymentType } from "../../../domain/enums/payment-type.enum";


import { ITransactionManager } from "../../../domain/interfaces/database/transaction-manager.interface";

import { IBookingRepository } from "../../../domain/interfaces/repositories/booking/IBookingRepository";

import { IBookingIdGenerator } from "../../../domain/interfaces/services/IBookingNumberGenerator";
import { IOffsiteCapacityValidationService } from "../../../domain/interfaces/services/validation/IOffsiteCapacityValidationService";

import { ICreateOffsiteBookingUseCase } from "../../../domain/interfaces/usecases/booking/ICreateOffsiteBookingUseCase";
import { CreateOffsiteBookingRequestDto } from "../../dtos/client/booking/request/Create-offsite-booking-request.dto";

import { CreateBookingResponseDto } from "../../dtos/client/booking/response/create-booking-response.dto";
import {
  BOOKING_PENDING_EXPIRY_MINUTES,
  PLATFORM_ADVANCE_PERCENTAGE,
} from "./create-booking.use-case";

export class CreateOffsiteBookingUseCase implements ICreateOffsiteBookingUseCase {
  constructor(
    private readonly bookingRepository: IBookingRepository,

    private readonly offsiteCapacityValidationService: IOffsiteCapacityValidationService,

    private readonly transactionManager: ITransactionManager,

    private readonly bookingIdGenerator: IBookingIdGenerator,
  ) {}

  async execute(
    clientId: string,
    data: CreateOffsiteBookingRequestDto,
  ): Promise<CreateBookingResponseDto> {

    /**
     * STEP 2
     * Validate capacity
     */

    const providerService = await this.offsiteCapacityValidationService.validate({
      providerServiceId: data.providerServiceId,

      bookingDate: data.bookingDate,
    });

    /**
     * STEP 3
     * Calculate payment
     */

    const totalAmount = providerService.price ?? 0;

    const paidAmount =
      data.paymentType === PaymentType.FULL
        ? totalAmount
        : (totalAmount * PLATFORM_ADVANCE_PERCENTAGE) / 100;

    /**
     * STEP 4
     * Expiry
     */

    const expiresAt = new Date(
      Date.now() + BOOKING_PENDING_EXPIRY_MINUTES * 60 * 1000,
    );

    /**
     * STEP 5
     * Generate booking id
     */

    const bookingId = await this.bookingIdGenerator.generate();

    /**
     * STEP 6
     * Create booking
     */

    const booking = Booking.create({
      bookingId,

      clientId,

      providerId: providerService.providerId,

      providerServiceId: providerService.id!,

      serviceId: providerService.serviceId,

      bookingMode: BookingMode.OFFSITE,

      status: BookingStatus.PENDING,

      paymentType: data.paymentType,

      totalAmount,

      paidAmount,

      bookingDate: data.bookingDate,

      endDateTime: null,

      startDateTime: null,

      location: null,

      requirements: data.requirements,

      notes: data.notes ?? null,

      expiresAt,
    });

    /**
     * STEP 7
     * Persist
     */
    return this.transactionManager.runInTransaction(async (transaction) => {
      const createdBooking = await this.bookingRepository.create(
        booking,
        transaction,
      );

      return {
        id: createdBooking.id!,

        bookingId: createdBooking.bookingId,

        status: createdBooking.status,

        paymentType: createdBooking.paymentType,

        paymentStatus: createdBooking.paymentStatus,

        totalAmount: createdBooking.totalAmount,

        paidAmount: createdBooking.paidAmount,

        remainingAmount: createdBooking.remainingAmount,

        expiresAt: createdBooking.expiresAt,

        location: null
      };
    });
  }
}
