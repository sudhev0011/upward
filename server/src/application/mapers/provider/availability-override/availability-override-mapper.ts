import { AvailabilityOverride } from "../../../../domain/entities/availability-override.entity";
import { EntityNotPersistedError } from "../../../../domain/errors/errors";
import { AvailabilityOverrideResponseDto } from "../../../dtos/provider/availability-override/availability-override-response.dto";

export class AvailabilityOverrideMapper {
  static toResponse(
    override: AvailabilityOverride
  ): AvailabilityOverrideResponseDto {
    if (!override.id) {
      throw new EntityNotPersistedError("AvailabilityOverride");
    }

    return {
      id: override.id,
      providerId: override.providerId,
      date: override.date,
      isWorking: override.isWorking,
      startTime: override.startTime,
      endTime: override.endTime,
      createdAt: override.createdAt,
      updatedAt: override.updatedAt,
    };
  }

  static toResponseList(
    overrides: AvailabilityOverride[]
  ): AvailabilityOverrideResponseDto[] {
    return overrides.map((o) => this.toResponse(o));
  }
}