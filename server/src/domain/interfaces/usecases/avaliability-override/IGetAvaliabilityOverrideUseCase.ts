import { AvailabilityOverrideResponseDto } from "../../../../application/dtos/provider/availability-override/availability-override-response.dto";

export interface IGetAvailabilityOverridesUseCase {
  /**
   * Fetch all availability overrides for a provider.
   * If date range is provided, filters overrides within that range.
   */
  execute(
    providerId: string,
    startDate?: string,
    endDate?: string
  ): Promise<AvailabilityOverrideResponseDto[]>;
}