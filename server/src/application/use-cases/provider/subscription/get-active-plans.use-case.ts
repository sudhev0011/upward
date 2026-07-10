import { SubscriptionPlan } from "../../../../domain/entities/subscription-plan.entity";
import { ISubscriptionPlanRepository } from "../../../../domain/interfaces/repositories/subscription-plan/ISubscriptionPlanRepository";
import { IGetActivePlansUseCase } from "../../../../domain/interfaces/usecases/subscription/IGetActivePlansUseCase";

export class GetActivePlansUseCase implements IGetActivePlansUseCase {
  constructor(
    private readonly subscriptionPlanRepository: ISubscriptionPlanRepository,
  ) {}

  async execute(): Promise<SubscriptionPlan[]> {
    return this.subscriptionPlanRepository.findActivePlans();
  }
}
