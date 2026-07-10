import { SubscriptionPlan } from "../../../../domain/entities/subscription-plan.entity";
import { ConflictError } from "../../../../domain/errors/errors";
import { ISubscriptionPlanRepository } from "../../../../domain/interfaces/repositories/subscription-plan/ISubscriptionPlanRepository";
import { ICreateSubscriptionPlanUseCase } from "../../../../domain/interfaces/usecases/subscription/ICreateSubscriptionPlanUseCase";
import { CreateSubscriptionPlanRequest } from "../../../dtos/admin/subscription/request/createSubscriptionPlanRequest.dto";

export class CreateSubscriptionPlanUseCase
  implements ICreateSubscriptionPlanUseCase {
  constructor(
    private readonly subscriptionPlanRepository: ISubscriptionPlanRepository,
  ) {}

  async execute(
    data: CreateSubscriptionPlanRequest,
  ): Promise<SubscriptionPlan> {
    const existing = await this.subscriptionPlanRepository.findByName(
      data.name.trim(),
    );

    if (existing) {
      throw new ConflictError("A subscription plan with this name already exists");
    }

    const plan = SubscriptionPlan.create({
      id: "",
      name: data.name.trim(),
      price: data.price,
      billingCycle: data.billingCycle,
      features: data.features,
      subscriberCount: 0,
      isActive: data.isActive ?? true,
    });

    return this.subscriptionPlanRepository.create(plan);
  }
}
