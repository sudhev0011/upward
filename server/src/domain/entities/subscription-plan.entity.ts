import { PlanFeatures } from "../interfaces/subscription-plan.interface";
export class SubscriptionPlan {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly price: number,
    public readonly billingCycle: "monthly" | "yearly",
    public readonly features: PlanFeatures,
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
    features?: Partial<PlanFeatures>;
    subscriberCount?: number;
    isActive?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
  }): SubscriptionPlan {
    const now = new Date();
    const defaultFeatures: PlanFeatures = {
      maxServices: 3,
      maxPortfolios: 3,
      maxManualUnavailability: 2,
      ...data.features,
    };

    return new SubscriptionPlan(
      data.id,
      data.name,
      data.price,
      data.billingCycle,
      defaultFeatures,
      data.subscriberCount ?? 0,
      data.isActive ?? true,
      data.createdAt ?? now,
      data.updatedAt ?? now,
    );
  }
}
