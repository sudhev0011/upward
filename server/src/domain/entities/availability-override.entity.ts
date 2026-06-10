export class AvailabilityOverride {
  constructor(
    public readonly id: string | undefined,
    public readonly providerId: string,
    public readonly date: string,
    public readonly isWorking: boolean,
    public readonly startTime: string | null,
    public readonly endTime: string | null,  
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {}

  static create(data: {
    id?: string;
    providerId: string;
    date: string;
    isWorking: boolean;
    startTime?: string | null;
    endTime?: string | null;
    createdAt?: Date;
    updatedAt?: Date;
  }): AvailabilityOverride {
    const now = new Date();

    return new AvailabilityOverride(
      data.id,
      data.providerId,
      data.date,
      data.isWorking,
      data.isWorking ? (data.startTime ?? null) : null,
      data.isWorking ? (data.endTime ?? null) : null,
      data.createdAt ?? now,
      data.updatedAt ?? now
    );
  }
}