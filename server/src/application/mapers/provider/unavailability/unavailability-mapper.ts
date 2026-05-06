import { Unavailability } from "../../../../domain/entities/unavailability.entity";
import { EntityNotPersistedError } from "../../../../domain/errors/errors";
import { UnavailabilityResponseDto } from "../../../dtos/provider/unavailability/unavailability-response.dto";

export class UnavailabilityMapper {
  static toResponse(unavailability: Unavailability): UnavailabilityResponseDto {
    if (!unavailability.id) {
      throw new EntityNotPersistedError("Unavailability");
    }

    return {
      id: unavailability.id,
      providerId: unavailability.providerId,
      startDate: unavailability.startDate,
      endDate: unavailability.endDate,
      reason: unavailability.reason,
      source: unavailability.source,
      bookingId: unavailability.bookingId,
      createdAt: unavailability.createdAt,
      updatedAt: unavailability.updatedAt,
    };
  }

  static toResponseList(
    unavailabilities: Unavailability[]
  ): UnavailabilityResponseDto[] {
    return unavailabilities.map((u) => this.toResponse(u));
  }
}