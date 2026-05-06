export interface DayScheduleResponseDto {
  isWorking: boolean;
  startTime: string | null;
  endTime: string | null;
}

export interface WeeklyScheduleResponseDto {
  sunday: DayScheduleResponseDto;
  monday: DayScheduleResponseDto;
  tuesday: DayScheduleResponseDto;
  wednesday: DayScheduleResponseDto;
  thursday: DayScheduleResponseDto;
  friday: DayScheduleResponseDto;
  saturday: DayScheduleResponseDto;
}

export interface AvailabilityResponseDto {
  id: string;
  providerId: string;
  timezone: string;
  availabilityWindow: number;
  weeklySchedule: WeeklyScheduleResponseDto;
  createdAt: Date;
  updatedAt: Date;
}