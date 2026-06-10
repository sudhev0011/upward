import { AvailabilityOverride } from "../../../../domain/entities/availability-override.entity";
import { ConflictError } from "../../../../domain/errors/errors";
import { IAvailabilityOverrideRepository } from "../../../../domain/interfaces/repositories/availability-override/IAvailability-override.repository";
import { IUnavailabilityRepository } from "../../../../domain/interfaces/repositories/unavailability/IUnavaliability-repository";
import { ISetAvailabilityOverrideUseCase } from "../../../../domain/interfaces/usecases/avaliability-override/ISetAvaliabilityOverrideUseCase";
import { SetAvailabilityOverrideRequestDto } from "../../../dtos/provider/availability-override/availability-override-request.dto";
import { AvailabilityOverrideResponseDto } from "../../../dtos/provider/availability-override/availability-override-response.dto";
import { AvailabilityOverrideMapper } from "../../../mapers/provider/availability-override/availability-override-mapper";
export class SetAvailabilityOverrideUseCase implements ISetAvailabilityOverrideUseCase{
  constructor(
    private readonly _availabilityOverrideRepository: IAvailabilityOverrideRepository,
    private readonly _unavailabilityRepository: IUnavailabilityRepository
  ) {}

  async execute(data: SetAvailabilityOverrideRequestDto & {providerId: string}): Promise<AvailabilityOverrideResponseDto> {
    
    const [y, m, d] = data.date.split("-").map(Number);
    const dayStart = new Date(y, m - 1, d, 0, 0, 0);
    const dayEnd = new Date(y, m - 1, d, 23, 59, 59);

    const overlapping = await this._unavailabilityRepository.findOverlapping(
      data.providerId,
      dayStart,
      dayEnd
    );

    if (overlapping.length > 0) {
      throw new ConflictError(
        "A manual unavailability block exists for this date. Remove it before adding an override."
      );
    }

    const override = AvailabilityOverride.create(data);
    const result = await this._availabilityOverrideRepository.upsertByProviderAndDate(
      data.providerId,
      data.date,
      override
    );

    return AvailabilityOverrideMapper.toResponse(result);
  }
}