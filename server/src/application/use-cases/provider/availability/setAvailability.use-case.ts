import { Availability } from "../../../../domain/entities/availability.entity";
import { IAvailabilityRepository } from "../../../../domain/interfaces/repositories/availability/IAvailabilityRepository";
import { SetAvailabilityRequestDto } from "../../../dtos/provider/availability/availability-request.dto";
import { AvailabilityResponseDto } from "../../../dtos/provider/availability/availability-response.dto";
import { AvailabilityMapper } from "../../../mapers/provider/availability/availability-mapper";

// Creates or fully replaces a provider's weekly schedule
export class SetAvailabilityUseCase {
  constructor(
    private readonly _availabilityRepository: IAvailabilityRepository
  ) {}

  async execute(data: SetAvailabilityRequestDto): Promise<AvailabilityResponseDto> {
    const availability = Availability.create(data);

    const result = await this._availabilityRepository.upsertByProviderId(
      data.providerId,
      availability
    );

    return AvailabilityMapper.toResponse(result);
  }
}