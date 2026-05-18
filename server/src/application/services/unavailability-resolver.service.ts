import { IUnavailabilityRepository } from "../../domain/interfaces/repositories/unavailability/IUnavaliability-repository";
import { TimeRange } from "../../domain/types/scheduling.types";

export class UnavailabilityResolverService {
  constructor(private unavailabilityRepository: IUnavailabilityRepository) {}

  async resolve(providerId: string, date: string): Promise<TimeRange[]> {
    const dayStartLocal = new Date(`${date}T00:00:00+05:30`);

    const dayEndLocal = new Date(`${date}T00:00:00+05:30`);

    dayEndLocal.setDate(dayEndLocal.getDate() + 1);

    const unavailabilities =
      await this.unavailabilityRepository.findOverlapping(
        providerId,
        dayStartLocal,
        dayEndLocal,
      );

    const blockedRanges: TimeRange[] = [];

    for (const item of unavailabilities) {
      const unavailableStart = new Date(item.startDate);

      const unavailableEnd = new Date(item.endDate);

      const overlapStart =
        unavailableStart > dayStartLocal ? unavailableStart : dayStartLocal;

      const overlapEnd =
        unavailableEnd < dayEndLocal ? unavailableEnd : dayEndLocal;

      if (overlapStart >= overlapEnd) {
        continue;
      }

      const startMinutes = Math.floor(
        (overlapStart.getTime() - dayStartLocal.getTime()) / (1000 * 60),
      );

      const endMinutes = Math.floor(
        (overlapEnd.getTime() - dayStartLocal.getTime()) / (1000 * 60),
      );

      blockedRanges.push({
        start: startMinutes,
        end: endMinutes,
      });
    }

    return blockedRanges;
  }
}
