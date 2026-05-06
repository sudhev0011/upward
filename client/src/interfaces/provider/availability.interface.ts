// Day schedule
export interface DaySchedule {
  isWorking: boolean;
  startTime: string | null;
  endTime: string | null;
}

// Full weekly schedule
export interface WeeklySchedule {
  sunday: DaySchedule;
  monday: DaySchedule;
  tuesday: DaySchedule;
  wednesday: DaySchedule;
  thursday: DaySchedule;
  friday: DaySchedule;
  saturday: DaySchedule;
}

// 🔹 Request DTOs

export interface SetAvailabilityRequest {
  timezone?: string; // default handled by backend
  availabilityWindow?: number; // default handled by backend
  weeklySchedule: WeeklySchedule;
}

// 🔹 Response DTO

export interface AvailabilityResponse {
  timezone: string;
  availabilityWindow: number;
  weeklySchedule: WeeklySchedule;
  createdAt: string; // frontend should use string (ISO)
  updatedAt: string;
}