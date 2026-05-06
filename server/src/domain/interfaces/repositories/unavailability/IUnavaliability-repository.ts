import { Unavailability } from "../../../../domain/entities/unavailability.entity";
import { UnavailabilitySource } from "../../../../domain/enums/unavailability.enum";
import { IBaseRepository } from "../base/IBaseRepository";

export interface IUnavailabilityRepository extends IBaseRepository<Unavailability> {
  /**
   * Get all unavailability blocks for a provider
   */
  findByProviderId(providerId: string): Promise<Unavailability[]>;

  /**
   * Find all blocks overlapping with a given date range
   */
  findOverlapping(
    providerId: string,
    rangeStart: Date,
    rangeEnd: Date
  ): Promise<Unavailability[]>;

  /**
   * Find unavailability by source (e.g., MANUAL, BOOKING)
   */
  findBySource(
    providerId: string,
    source: UnavailabilitySource
  ): Promise<Unavailability[]>;

  /**
   * Delete unavailability linked to a booking
   */
  deleteByBookingId(bookingId: string): Promise<boolean>;

  /**
   * Delete all manual unavailability blocks within a date range
   */
  deleteManualInRange(
    providerId: string,
    rangeStart: Date,
    rangeEnd: Date
  ): Promise<number>;
}