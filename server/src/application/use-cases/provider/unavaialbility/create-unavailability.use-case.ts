import { Unavailability } from "../../../../domain/entities/unavailability.entity";
import { UnavailabilitySource } from "../../../../domain/enums/unavailability.enum";
import {
  ConflictError,
  LimitError,
  ValidationError,
} from "../../../../domain/errors/errors";
import { IAvailabilityOverrideRepository } from "../../../../domain/interfaces/repositories/availability-override/IAvailability-override.repository";
import { IProviderSubscriptionRepository } from "../../../../domain/interfaces/repositories/provider-subscription/IProviderSubscriptionRepository";
import { IUnavailabilityRepository } from "../../../../domain/interfaces/repositories/unavailability/IUnavaliability-repository";
import { CreateUnavailabilityRequestDto } from "../../../dtos/provider/unavailability/unavailability-request.dto";
import { UnavailabilityResponseDto } from "../../../dtos/provider/unavailability/unavailability-response.dto";
import { UnavailabilityMapper } from "../../../mapers/provider/unavailability/unavailability-mapper";

export class CreateUnavailabilityUseCase {
  constructor(
    private readonly _unavailabilityRepository: IUnavailabilityRepository,
    private readonly _availabilityOverrideRepository: IAvailabilityOverrideRepository,
    private readonly _providerSubscriptionRepository: IProviderSubscriptionRepository,
  ) {}

  async execute(
    data: CreateUnavailabilityRequestDto,
  ): Promise<UnavailabilityResponseDto> {
    if (data.source === UnavailabilitySource.MANUAL) {
      const limits =
        await this._providerSubscriptionRepository.getActivePlanLimitsByProvider(
          data.providerId,
        );

      const rolling30DayCount =
        await this._unavailabilityRepository.countManualByProviderForLast30Days(
          data.providerId,
        );

      if (rolling30DayCount >= limits.maxManualUnavailability) {
        throw new LimitError(
          `Limit reached of your plan. You have already created ${rolling30DayCount} manual unavailabilities in the last 30 days.`,
        );
      }
    }
    const dateOnly = data.endDate.toISOString().split("T")[0];

    const overRide = await this._availabilityOverrideRepository.findOne({
      date: dateOnly,
    });

    if (overRide) {
      throw new ValidationError(
        "Override exists on this date delete that first",
      );
    }

    const overlapping = await this._unavailabilityRepository.findOverlapping(
      data.providerId,
      data.startDate,
      data.endDate,
    );

    if (overlapping.length > 0) {
      throw new ConflictError(
        "An unavailability block already exists for this time range",
      );
    }

    const unavailability = Unavailability.create(data);
    const result = await this._unavailabilityRepository.create(unavailability);

    return UnavailabilityMapper.toResponse(result);
  }
}
