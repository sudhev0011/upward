import { SubscriptionPlan } from "../../../../domain/entities/subscription-plan.entity";
import { NotFoundError, ConflictError } from "../../../../domain/errors/errors";
import { ISubscriptionPlanRepository } from "../../../../domain/interfaces/repositories/subscription-plan/ISubscriptionPlanRepository";
import { IUpdateSubscriptionPlanUseCase } from "../../../../domain/interfaces/usecases/subscription/IUpdateSubscriptionPlanUseCase";
import { UpdateSubscriptionPlanRequest } from "../../../dtos/admin/subscription/request/createSubscriptionPlanRequest.dto";

export class UpdateSubscriptionPlanUseCase implements IUpdateSubscriptionPlanUseCase {
  constructor(
    private readonly subscriptionPlanRepository: ISubscriptionPlanRepository,
  ) {}

  async execute(
    planId: string,
    data: UpdateSubscriptionPlanRequest,
  ): Promise<SubscriptionPlan> {
    const plan = await this.subscriptionPlanRepository.findById(planId);

    if (!plan) {
      throw new NotFoundError("Subscription plan not found");
    }

    if (data.name !== undefined && data.name.trim() !== plan.name) {
      const existing = await this.subscriptionPlanRepository.findByName(
        data.name.trim(),
      );
      if (existing) {
        throw new ConflictError(
          "A subscription plan with this name already exists",
        );
      }
    }

    const updatedPlan = SubscriptionPlan.create({
      id: plan.id,
      name: data.name !== undefined ? data.name.trim() : plan.name,
      price: data.price !== undefined ? data.price : plan.price,
      billingCycle:
        data.billingCycle !== undefined ? data.billingCycle : plan.billingCycle,
      features: data.features !== undefined ? data.features : plan.features,
      subscriberCount: plan.subscriberCount,
      isActive: data.isActive !== undefined ? data.isActive : plan.isActive,
      createdAt: plan.createdAt,
      updatedAt: new Date(),
    });

    await this.subscriptionPlanRepository.update(plan.id, updatedPlan);
    return updatedPlan;
  }
}
