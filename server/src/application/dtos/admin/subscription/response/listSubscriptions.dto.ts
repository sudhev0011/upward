import { SubscriptionPlan } from "../../../../../domain/entities/subscription-plan.entity";

export interface ListSubscriptionsDto{

    data: SubscriptionPlan[]
    total: number;
    page: number;
    limit: number;
    totalPages: number
}