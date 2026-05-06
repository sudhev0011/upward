import { DAYS } from "@/constants/availability.constant";

export type DayKey = (typeof DAYS)[number];

export interface LocalDaySchedule {
  enabled: boolean;
  start: string; 
  end: string;   
}

export const DEFAULT_SCHEDULE: Record<DayKey, LocalDaySchedule> = {
  monday:    { enabled: true,  start: "09:00", end: "18:00" },
  tuesday:   { enabled: true,  start: "09:00", end: "18:00" },
  wednesday: { enabled: true,  start: "09:00", end: "18:00" },
  thursday:  { enabled: true,  start: "09:00", end: "18:00" },
  friday:    { enabled: true,  start: "09:00", end: "18:00" },
  saturday:  { enabled: false, start: "09:00", end: "18:00" },
  sunday:    { enabled: false, start: "09:00", end: "18:00" },
};