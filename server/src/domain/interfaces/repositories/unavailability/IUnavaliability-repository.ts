import { Unavailability } from "../../../../domain/entities/unavailability.entity";
import { UnavailabilitySource } from "../../../../domain/enums/unavailability.enum";
import { IBaseRepository } from "../base/IBaseRepository";

export interface IUnavailabilityRepository extends IBaseRepository<Unavailability> {
  findByProviderId(providerId: string): Promise<Unavailability[]>;

  findOverlapping(
    providerId: string,
    rangeStart: Date,
    rangeEnd: Date,
  ): Promise<Unavailability[]>;

  findBySource(
    providerId: string,
    source: UnavailabilitySource,
  ): Promise<Unavailability[]>;

  deleteByBookingId(bookingId: string): Promise<boolean>;

  deleteManualInRange(
    providerId: string,
    rangeStart: Date,
    rangeEnd: Date,
  ): Promise<number>;
}
