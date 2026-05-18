import {
  SlotResult,
  TimeRange,
} from "../types/scheduling.types";
import { TimeUtil } from "../../shared/utils/time.util";

export class SlotGenerationService {
  static generate(
    freeRanges: TimeRange[],
    durationMinutes: number,
    intervalMinutes: number
  ): SlotResult[] {
    const slots: SlotResult[] = [];

    for (const range of freeRanges) {
      let current = range.start;

      while (current + durationMinutes <= range.end) {
        slots.push({
          startTime: TimeUtil.minutesToTimeString(current),
          endTime: TimeUtil.minutesToTimeString(
            current + durationMinutes
          ),
        });

        current += intervalMinutes;
      }
    }

    return slots;
  }
}