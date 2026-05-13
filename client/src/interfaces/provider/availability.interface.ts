export interface DaySchedule {
  isWorking: boolean;
  startTime: string | null;
  endTime: string | null;
}
export interface WeeklySchedule {
  sunday: DaySchedule;
  monday: DaySchedule;
  tuesday: DaySchedule;
  wednesday: DaySchedule;
  thursday: DaySchedule;
  friday: DaySchedule;
  saturday: DaySchedule;
}
export interface SetAvailabilityRequest {
  timezone?: string;
  availabilityWindow?: number;
  weeklySchedule: WeeklySchedule;
}

export interface AvailabilityResponse {
  timezone: string;
  availabilityWindow: number;
  weeklySchedule: WeeklySchedule;
  createdAt: string;
  updatedAt: string;
}
