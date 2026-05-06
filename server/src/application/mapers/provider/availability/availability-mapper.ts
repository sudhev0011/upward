import { Availability } from "../../../../domain/entities/availability.entity";
import { EntityNotPersistedError } from "../../../../domain/errors/errors";
import { AvailabilityResponseDto } from "../../../dtos/provider/availability/availability-response.dto";

export class AvailabilityMapper {
  static toResponse(availability: Availability): AvailabilityResponseDto {
    if (!availability.id) {
      throw new EntityNotPersistedError("Availability");
    }

    return {
      id: availability.id,
      providerId: availability.providerId,
      timezone: availability.timezone,
      availabilityWindow: availability.availabilityWindow,
      weeklySchedule: {
        sunday: availability.weeklySchedule.sunday,
        monday: availability.weeklySchedule.monday,
        tuesday: availability.weeklySchedule.tuesday,
        wednesday: availability.weeklySchedule.wednesday,
        thursday: availability.weeklySchedule.thursday,
        friday: availability.weeklySchedule.friday,
        saturday: availability.weeklySchedule.saturday,
      },
      createdAt: availability.createdAt,
      updatedAt: availability.updatedAt,
    };
  }
}