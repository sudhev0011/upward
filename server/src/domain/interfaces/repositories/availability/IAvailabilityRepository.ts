import { Availability } from "../../../../domain/entities/availability.entity";
import { IBaseRepository } from "../base/IBaseRepository";

export interface IAvailabilityRepository extends IBaseRepository<Availability> {
  findByProviderId(providerId: string): Promise<Availability | null>;
  upsertByProviderId(
    providerId: string,
    data: Partial<Availability>
  ): Promise<Availability>;
}