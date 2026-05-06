import { Unavailability } from "../../../../domain/entities/unavailability.entity";
import { ConflictError } from "../../../../domain/errors/errors";
import { IUnavailabilityRepository } from "../../../../domain/interfaces/repositories/unavailability/IUnavaliability-repository";
import { CreateUnavailabilityRequestDto } from "../../../dtos/provider/unavailability/unavailability-request.dto";
import { UnavailabilityResponseDto } from "../../../dtos/provider/unavailability/unavailability-response.dto";
import { UnavailabilityMapper } from "../../../mapers/provider/unavailability/unavailability-mapper";

export class CreateUnavailabilityUseCase {
  constructor(
    private readonly _unavailabilityRepository: IUnavailabilityRepository
  ) {}

  async execute(
    data: CreateUnavailabilityRequestDto
  ): Promise<UnavailabilityResponseDto> {

    // Check for overlapping manual blocks to avoid duplicates
    const overlapping = await this._unavailabilityRepository.findOverlapping(
      data.providerId,
      data.startDate,
      data.endDate
    );

    if (overlapping.length > 0) {
      throw new ConflictError(
        "An unavailability block already exists for this time range"
      );
    }

    const unavailability = Unavailability.create(data);
    const result = await this._unavailabilityRepository.create(unavailability);

    return UnavailabilityMapper.toResponse(result);
  }
}