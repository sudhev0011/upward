import { NotFoundError } from "../../../../domain/errors/errors";
import { IAvailabilityRepository } from "../../../../domain/interfaces/repositories/availability/IAvailabilityRepository";
import { AvailabilityResponseDto } from "../../../dtos/provider/availability/availability-response.dto";
import { AvailabilityMapper } from "../../../mapers/provider/availability/availability-mapper";

export class GetAvailabilityUseCase {
  constructor(
    private readonly _availabilityRepository: IAvailabilityRepository
  ) {}

  async execute(providerId: string): Promise<AvailabilityResponseDto> {
    const availability =
      await this._availabilityRepository.findByProviderId(providerId);

    if (!availability) {
      throw new NotFoundError("Availability not found for this provider");
    }

    return AvailabilityMapper.toResponse(availability);
  }
}