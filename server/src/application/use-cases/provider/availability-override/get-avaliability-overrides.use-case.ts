import { IAvailabilityOverrideRepository } from "../../../../domain/interfaces/repositories/availability-override/IAvailability-override.repository";
import { AvailabilityOverrideResponseDto } from "../../../dtos/provider/availability-override/availability-override-response.dto";
import { AvailabilityOverrideMapper } from "../../../mapers/provider/availability-override/availability-override-mapper";

export class GetAvailabilityOverridesUseCase {
  constructor(
    private readonly _availabilityOverrideRepository: IAvailabilityOverrideRepository
  ) {}

  async execute(
    providerId: string,
    startDate?: string, 
    endDate?: string    
  ): Promise<AvailabilityOverrideResponseDto[]> {
    const results =
      startDate && endDate
        ? await this._availabilityOverrideRepository.findByProviderInDateRange(
            providerId,
            startDate,
            endDate
          )
        : await this._availabilityOverrideRepository.findByProviderId(
            providerId
          );

    return AvailabilityOverrideMapper.toResponseList(results);
  }
}