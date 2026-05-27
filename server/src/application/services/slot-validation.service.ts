import { WorkingHoursResolverService } from "./working-hours-resolver.service";
import { UnavailabilityResolverService } from "./unavailability-resolver.service";
import { TimeUtil } from "../../shared/utils/time.util";
import { NotFoundError } from "../../domain/errors/errors";
import { UnprocessableEntityError } from "../../domain/errors/errors";
import { IProviderServiceRepository } from "../../domain/interfaces/repositories/provider/IProviderServiceRepository";
import { IServiceRepository } from "../../domain/interfaces/repositories/service/IServiceRepository";
import { ICategoryRepository } from "../../domain/interfaces/repositories/category/ICategoryRepository";
import { IBookingRepository } from "../../domain/interfaces/repositories/booking/IBookingRepository";
import { SlotValidationResult } from "../../domain/types/slot-validation-result.types";


export class SlotValidationService {
  constructor(
    private providerServiceRepository: IProviderServiceRepository,

    private serviceRepository: IServiceRepository,

    private categoryRepository: ICategoryRepository,

    private bookingRepository: IBookingRepository,

    private workingHoursResolver: WorkingHoursResolverService,

    private unavailabilityResolver: UnavailabilityResolverService
  ) {}

  async validate(data: {
    providerServiceId: string;

    bookingDate: string;

    startTime: string;
  }): Promise<SlotValidationResult> {
    /**
     * STEP 1
     * Validate provider service
     */

    const providerService =
      await this.providerServiceRepository.findById(
        data.providerServiceId
      );

    if (!providerService || !providerService.isActive) {
      throw new NotFoundError(
        "Provider service not found"
      );
    }

    if(!providerService.price){
      throw new UnprocessableEntityError("Provider Service has no price")
    }

    /**
     * STEP 2
     * Validate service
     */

    const service =
      await this.serviceRepository.findById(
        providerService.serviceId
      );

    if (!service || !service.isActive) {
      throw new NotFoundError(
        "Service not found"
      );
    }


    /**
     * STEP 3
     * Validate category
     */

    const category =
      await this.categoryRepository.findById(
        service.categoryId
      );

    if (!category || !category.isActive) {
      throw new NotFoundError(
        "Category not found"
      );
    }

    /**
     * STEP 4
     * Only onsite scheduling supported
     */

    if (category.mode !== "onsite") {
      throw new UnprocessableEntityError(
        "Scheduling not supported for this service"
      );
    }

    /**
     * STEP 5
     * Validate service duration
     */

    if (!service.maxHour || service.maxHour <= 0) {
      throw new UnprocessableEntityError(
        "Invalid service duration"
      );
    }

    /**
     * STEP 6
     * Resolve working hours
     */

    const workingHours =
      await this.workingHoursResolver.resolve(
        providerService.providerId,
        data.bookingDate
      );

    if (!workingHours || !workingHours.startTime || !workingHours.endTime) {
      throw new UnprocessableEntityError(
        "Provider not available on this date"
      );
    }

    /**
     * STEP 7
     * Calculate requested slot
     */

    const durationMinutes =
      service.maxHour * 60;

    const startMinutes =
      TimeUtil.timeStringToMinutes(
        data.startTime
      );

    const endMinutes =
      startMinutes + durationMinutes;

    /**
     * STEP 8
     * Validate slot inside working hours
     */

    const workingStart =
      TimeUtil.timeStringToMinutes(
        workingHours.startTime
      );

    const workingEnd =
      TimeUtil.timeStringToMinutes(
        workingHours.endTime
      );

    if (
      startMinutes < workingStart ||
      endMinutes > workingEnd
    ) {
      throw new UnprocessableEntityError(
        "Requested slot outside working hours"
      );
    }

    /**
     * STEP 9
     * Validate unavailability overlap
     */

    const blockedRanges =
      await this.unavailabilityResolver.resolve(
        providerService.providerId,
        data.bookingDate
      );
      
    const overlapsBlockedRange =
      blockedRanges.some((range) => {
        return (
          startMinutes < range.end &&
          endMinutes > range.start
        );
      });

    if (overlapsBlockedRange) {
      throw new UnprocessableEntityError(
        "Requested slot unavailable"
      );
    }

    /**
     * STEP 10
     * Create datetime range
     */

    const startDateTime = new Date(
      `${data.bookingDate}T${data.startTime}:00+05:30`
    );

    const endDateTime = new Date(
      startDateTime.getTime() +
        durationMinutes * 60 * 1000
    );

    /**
     * STEP 11
     * Validate overlapping active booking
     */

    const overlappingBooking =
      await this.bookingRepository.findOverlappingActiveBooking(
        providerService.providerId,
        startDateTime,
        endDateTime
      );

    if (overlappingBooking) {
      throw new UnprocessableEntityError(
        "Slot already booked"
      );
    }

    /**
     * STEP 12
     * Return resolved booking metadata
     */

    return {
      valid: true,

      providerId:
        providerService.providerId,

      serviceId:
        providerService.serviceId,

      startDateTime,

      endDateTime,

      totalAmount:
        providerService.price,
    };
  }
}