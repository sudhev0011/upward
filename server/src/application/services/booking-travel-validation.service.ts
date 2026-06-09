import { ValidationError } from "../../domain/errors/errors";

import { IBookingRepository } from "../../domain/interfaces/repositories/booking/IBookingRepository";

import { MapsService } from "../../domain/interfaces/services/maps/maps.service";

import { Location } from "../../domain/interfaces/location.interface";

import {
  MAX_ADJACENT_BOOKING_TRAVEL_MINUTES,
  MAX_PROVIDER_CLIENT_TRAVEL_MINUTES,
} from "../../domain/constants/booking.travel";

import { IProviderProfileRepository } from "../../domain/interfaces/repositories/provider/IProviderProfileRepository";

interface ValidateBookingTravelInput {
  providerId: string;

  bookingLocation: Location;

  bookingDate: string;

  startDateTime: Date;

  endDateTime: Date;
}

export class BookingTravelValidationService {
  constructor(
    private bookingRepository: IBookingRepository,

    private providerProfileRepository: IProviderProfileRepository,

    private mapsService: MapsService,
  ) {}

  async validate(input: ValidateBookingTravelInput): Promise<void> {
    /**
     * STEP 1
     * Fetch provider profile
     */

    const providerProfile = await this.providerProfileRepository.findOne({
      userId: input.providerId,
    });

    if (!providerProfile || !providerProfile.location) {
      throw new ValidationError("Provider location not configured");
    }

    const providerLocation = providerProfile.location;

    /**
     * STEP 2
     * Provider → client travel validation
     */

    await this.validateProviderClientTravel(
      providerLocation,
      input.bookingLocation,
    );

    /**
     * STEP 3
     * Previous booking validation
     */

    await this.validatePreviousBookingTravel(input);

    /**
     * STEP 4
     * Next booking validation
     */

    await this.validateNextBookingTravel(input);
  }

  /**
   * Validate provider ↔ client travel
   */

  private async validateProviderClientTravel(
    providerLocation: Location,

    bookingLocation: Location,
  ): Promise<void> {
    const result = await this.mapsService.getTravelDistanceAndDuration(
      providerLocation.coordinates.coordinates,

      bookingLocation.coordinates.coordinates,
    );

    const durationMinutes = result.durationSeconds / 60;

    if (durationMinutes > MAX_PROVIDER_CLIENT_TRAVEL_MINUTES) {
      throw new ValidationError(
        `Provider is too far from booking location (${Math.ceil(durationMinutes)} mins away)`,
      );
    }
  }

  /**
   * Validate previous booking feasibility
   */

  private async validatePreviousBookingTravel(
    input: ValidateBookingTravelInput,
  ): Promise<void> {
    const previousBooking =
      await this.bookingRepository.findPreviousActiveBooking(
        input.providerId,
        input.bookingDate,
        input.startDateTime,
      );

    if (!previousBooking || !previousBooking.location) {
      return;
    }

    const result = await this.mapsService.getTravelDistanceAndDuration(
      previousBooking.location.coordinates.coordinates,

      input.bookingLocation.coordinates.coordinates,
    );

    const durationMinutes = result.durationSeconds / 60;

    const availableGapMinutes =
      (input.startDateTime.getTime() - previousBooking.endDateTime!.getTime()) /
      (1000 * 60);

    /**
     * Provider cannot physically reach
     */

    if (durationMinutes > availableGapMinutes) {
      throw new ValidationError(
        `Provider does not have enough travel time from previous booking(${Math.floor(durationMinutes)} minutes)`,
      );
    }

    /**
     * Booking too geographically far
     */

    if (durationMinutes > MAX_ADJACENT_BOOKING_TRAVEL_MINUTES) {
      throw new ValidationError(
        `Booking is too far from previous booking (${Math.ceil(durationMinutes)} mins travel)`,
      );
    }
  }

  /**
   * Validate next booking feasibility
   */

  private async validateNextBookingTravel(
    input: ValidateBookingTravelInput,
  ): Promise<void> {
    const nextBooking = await this.bookingRepository.findNextActiveBooking(
      input.providerId,
      input.bookingDate,

      input.endDateTime,
    );
    console.log(nextBooking,'--------------')
    if (!nextBooking || !nextBooking.location) {
      return;
    }

    const result = await this.mapsService.getTravelDistanceAndDuration(
      input.bookingLocation.coordinates.coordinates,

      nextBooking.location.coordinates.coordinates,
    );

    const durationMinutes = result.durationSeconds / 60;

    const availableGapMinutes =
      (nextBooking.startDateTime!.getTime() - input.endDateTime.getTime()) /
      (1000 * 60);

    /**
     * Provider cannot physically reach
     */

    if (durationMinutes > availableGapMinutes) {
      throw new ValidationError(
        "Provider does not have enough travel time to next booking",
      );
    }

    /**
     * Booking too geographically far
     */

    if (durationMinutes > MAX_ADJACENT_BOOKING_TRAVEL_MINUTES) {
      throw new ValidationError(
        `Booking is too far from next booking (${Math.ceil(durationMinutes)} mins travel)`,
      );
    }
  }
}
