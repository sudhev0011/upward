import { SubscriptionPlan } from "../../../../domain/entities/subscription-plan.entity";
import { ISubscriptionPlanRepository } from "../../../../domain/interfaces/repositories/subscription-plan/ISubscriptionPlanRepository";

export class GetActivePlansUseCase {
  constructor(
    private readonly subscriptionPlanRepository: ISubscriptionPlanRepository,
  ) {}

  async execute(): Promise<SubscriptionPlan[]> {
    return this.subscriptionPlanRepository.findActivePlans();
  }
}
