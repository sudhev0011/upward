import { TimeRange } from "../types/scheduling.types";

export class RangeCalculationService {
  static isOverlapping(a: TimeRange, b: TimeRange): boolean {
    return a.start < b.end && a.end > b.start;
  }

  static mergeRanges(ranges: TimeRange[]): TimeRange[] {
    if (!ranges.length) return [];

    const sorted = [...ranges].sort((a, b) => a.start - b.start);

    const merged: TimeRange[] = [sorted[0]];

    for (let i = 1; i < sorted.length; i++) {
      const current = sorted[i];
      const last = merged[merged.length - 1];

      if (current.start <= last.end) {
        last.end = Math.max(last.end, current.end);
      } else {
        merged.push(current);
      }
    }

    return merged;
  }

  static subtractRanges(
    workingRange: TimeRange,
    blockedRanges: TimeRange[]
  ): TimeRange[] {
    if (!blockedRanges.length) {
      console.log('at here')
      return [workingRange];
    }

    const mergedBlocked = this.mergeRanges(blockedRanges);

    const freeRanges: TimeRange[] = [];

    let currentStart = workingRange.start;

    for (const blocked of mergedBlocked) {
      if (blocked.end <= workingRange.start) continue;

      if (blocked.start >= workingRange.end) continue;

      const clippedStart = Math.max(blocked.start, workingRange.start);
      const clippedEnd = Math.min(blocked.end, workingRange.end);

      if (clippedStart > currentStart) {
        freeRanges.push({
          start: currentStart,
          end: clippedStart,
        });
      }

      currentStart = Math.max(currentStart, clippedEnd);
    }

    if (currentStart < workingRange.end) {
      freeRanges.push({
        start: currentStart,
        end: workingRange.end,
      });
    }

    return freeRanges;
  }
}