import { IUnavailabilityRepository } from "../../../../domain/interfaces/repositories/unavailability/IUnavaliability-repository";
import { UnavailabilityResponseDto } from "../../../dtos/provider/unavailability/unavailability-response.dto";
import { UnavailabilityMapper } from "../../../mapers/provider/unavailability/unavailability-mapper";

export class GetUnavailabilitiesUseCase {
  constructor(
    private readonly _unavailabilityRepository: IUnavailabilityRepository
  ) {}

  async execute(providerId: string): Promise<UnavailabilityResponseDto[]> {
    const results =
      await this._unavailabilityRepository.findByProviderId(providerId);

    return UnavailabilityMapper.toResponseList(results);
  }
}