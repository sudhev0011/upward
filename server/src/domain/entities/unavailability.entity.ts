import { UnavailabilitySource } from "../enums/unavailability.enum";

export class Unavailability {
  constructor(
    public readonly id: string | undefined,
    public readonly providerId: string,
    public readonly startDate: Date,
    public readonly endDate: Date,
    public readonly reason: string | null,
    public readonly source: UnavailabilitySource,
    public readonly bookingId: string | null,
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {}

  static create(data: {
    id?: string;
    providerId: string;
    startDate: Date;
    endDate: Date;
    reason?: string | null;
    source: UnavailabilitySource;
    bookingId?: string | null;
    createdAt?: Date;
    updatedAt?: Date;
  }): Unavailability {
    const now = new Date();

    return new Unavailability(
      data.id,
      data.providerId,
      data.startDate,
      data.endDate,
      data.reason ?? null,
      data.source,
      data.bookingId ?? null,
      data.createdAt ?? now,
      data.updatedAt ?? now
    );
  }
}