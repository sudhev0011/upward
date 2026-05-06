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

export class Availability {
  constructor(
    public readonly id: string | undefined,
    public readonly providerId: string,
    public readonly timezone: string,
    public readonly availabilityWindow: number,
    public readonly weeklySchedule: WeeklySchedule,
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {}

  static create(data: {
    id?: string;
    providerId: string;
    timezone?: string;
    availabilityWindow?: number;
    weeklySchedule: WeeklySchedule;
    createdAt?: Date;
    updatedAt?: Date;
  }): Availability {
    const now = new Date();

    return new Availability(
      data.id,
      data.providerId,
      data.timezone ?? "Asia/Kolkata",
      data.availabilityWindow ?? 7,
      data.weeklySchedule,
      data.createdAt ?? now,
      data.updatedAt ?? now
    );
  }
}