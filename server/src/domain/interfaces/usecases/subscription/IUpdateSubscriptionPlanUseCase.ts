import { UpdateSubscriptionPlanRequest } from "../../../../application/dtos/admin/subscription/request/createSubscriptionPlanRequest.dto";
import { SubscriptionPlan } from "../../../../domain/entities/subscription-plan.entity";

export interface IUpdateSubscriptionPlanUseCase {
  execute(
    planId: string,
    data: UpdateSubscriptionPlanRequest,
  ): Promise<SubscriptionPlan>;
}