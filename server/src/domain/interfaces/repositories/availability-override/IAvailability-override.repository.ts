import { AvailabilityOverride } from "../../../../domain/entities/availability-override.entity";
import { IBaseRepository } from "../base/IBaseRepository";

export interface IAvailabilityOverrideRepository extends IBaseRepository<AvailabilityOverride> {
  
  findByProviderId(providerId: string): Promise<AvailabilityOverride[]>;


  findByProviderAndDate(
    providerId: string,
    date: string
  ): Promise<AvailabilityOverride | null>;

  
  findByProviderInDateRange(
    providerId: string,
    startDate: string,
    endDate: string
  ): Promise<AvailabilityOverride[]>;

 
  upsertByProviderAndDate(
    providerId: string,
    date: string,
    data: Partial<AvailabilityOverride>
  ): Promise<AvailabilityOverride>;

  
  deleteByProviderAndDate(
    providerId: string,
    date: string
  ): Promise<boolean>;
}