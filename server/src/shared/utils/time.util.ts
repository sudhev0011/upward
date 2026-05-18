export class TimeUtil {
  static timeStringToMinutes(time: string): number {
    const [hours, minutes] = time.split(":").map(Number);

    return hours * 60 + minutes;
  }

  static minutesToTimeString(minutes: number): string {
    const hrs = Math.floor(minutes / 60)
      .toString()
      .padStart(2, "0");

    const mins = (minutes % 60)
      .toString()
      .padStart(2, "0");

    return `${hrs}:${mins}`;
  }
}