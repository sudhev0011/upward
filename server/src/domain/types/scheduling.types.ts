export interface TimeRange {
  start: number; // minutes from midnight
  end: number;
}

export interface WorkingHoursResult {
  startTime: string;
  endTime: string;
}

export interface SlotResult {
  startTime: string;
  endTime: string;
}