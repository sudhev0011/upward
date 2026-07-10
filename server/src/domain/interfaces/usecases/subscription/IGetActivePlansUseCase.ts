import { SubscriptionPlan } from "../../../../domain/entities/subscription-plan.entity";

export interface IGetActivePlansUseCase {
  execute(): Promise<SubscriptionPlan[]>;
}