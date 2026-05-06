import { AvailabilityOverride } from "../../../../domain/entities/availability-override.entity";

export interface IAvailabilityOverrideRepository {
  
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