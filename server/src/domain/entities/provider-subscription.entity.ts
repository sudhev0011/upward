export class ProviderSubscription {
  constructor(
    public readonly id: string,
    public readonly providerId: string,
    public readonly planId: string,
    public readonly amount: number,
    public readonly status: "pending" | "active" | "expired" | "cancelled",
    public readonly startDate: Date | null,
    public readonly endDate: Date | null,
    public readonly stripePaymentIntentId: string | null,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}

  static create(data: {
    id: string;
    providerId: string;
    planId: string;
    amount: number;
    status: "pending" | "active" | "expired" | "cancelled";
    startDate?: Date | null;
    endDate?: Date | null;
    stripePaymentIntentId?: string | null;
    createdAt?: Date;
    updatedAt?: Date;
  }): ProviderSubscription {
    const now = new Date();
    return new ProviderSubscription(
      data.id,
      data.providerId,
      data.planId,
      data.amount,
      data.status,
      data.startDate ?? null,
      data.endDate ?? null,
      data.stripePaymentIntentId ?? null,
      data.createdAt ?? now,
      data.updatedAt ?? now,
    );
  }
}
