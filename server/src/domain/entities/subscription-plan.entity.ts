export class SubscriptionPlan {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly price: number,
    public readonly billingCycle: "monthly" | "yearly",
    public readonly features: string[],
    public readonly subscriberCount: number,
    public readonly isActive: boolean,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}

  static create(data: {
    id: string;
    name: string;
    price: number;
    billingCycle: "monthly" | "yearly";
    features?: string[];
    subscriberCount?: number;
    isActive?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
  }): SubscriptionPlan {
    const now = new Date();
    return new SubscriptionPlan(
      data.id,
      data.name,
      data.price,
      data.billingCycle,
      data.features ?? [],
      data.subscriberCount ?? 0,
      data.isActive ?? true,
      data.createdAt ?? now,
      data.updatedAt ?? now,
    );
  }
}
