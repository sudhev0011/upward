import { ConflictError } from "../../domain/errors/errors";
import { IAvailabilityOverrideRepository } from "../../domain/interfaces/repositories/availability-override/IAvailability-override.repository";
import { IAvailabilityRepository } from "../../domain/interfaces/repositories/availability/IAvailabilityRepository";

const WEEK_DAYS = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
] as const;

export class WorkingHoursResolverService {
  constructor(
    private availabilityRepository: IAvailabilityRepository,
    private availabilityOverrideRepository: IAvailabilityOverrideRepository,
  ) {}

  async resolve(providerId: string, date: string) {
    const override =
      await this.availabilityOverrideRepository.findByProviderAndDate(
        providerId,
        date,
      );

    if (override) {
      return {
        startTime: override.startTime,
        endTime: override.endTime,
      };
    }

    const availability =
      await this.availabilityRepository.findByProviderId(providerId);

    if (!availability) {
      return null;
    }

    const jsDate = new Date(date);

    const dayName = WEEK_DAYS[jsDate.getDay()];

    const daySchedule = availability.weeklySchedule[dayName];

    if (!daySchedule.isWorking) {
      throw new ConflictError("Selected date is a holiday");
    }

    return {
      startTime: daySchedule.startTime,
      endTime: daySchedule.endTime,
    };
  }
}
