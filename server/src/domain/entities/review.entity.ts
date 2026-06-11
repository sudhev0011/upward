export class Review {
  constructor(
    public readonly id: string | undefined,
    public readonly bookingId: string,
    public readonly clientId: string,
    public readonly providerId: string,
    public readonly serviceId: string,
    public readonly rating: number,
    public readonly comment: string | null,
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {}

  static create(data: {
    id?: string;
    bookingId: string;
    clientId: string;
    providerId: string;
    serviceId: string;
    rating: number;
    comment?: string | null;
    createdAt?: Date;
    updatedAt?: Date;
  }): Review {
    const now = new Date();
    return new Review(
      data.id,
      data.bookingId,
      data.clientId,
      data.providerId,
      data.serviceId,
      data.rating,
      data.comment ?? null,
      data.createdAt ?? now,
      data.updatedAt ?? now
    );
  }
}
