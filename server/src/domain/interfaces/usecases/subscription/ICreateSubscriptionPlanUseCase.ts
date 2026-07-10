import { CreateSubscriptionPlanRequest } from "../../../../application/dtos/admin/subscription/request/createSubscriptionPlanRequest.dto";
import { SubscriptionPlan } from "../../../../domain/entities/subscription-plan.entity";

export interface ICreateSubscriptionPlanUseCase {
  execute(
    data: CreateSubscriptionPlanRequest,
  ): Promise<SubscriptionPlan>;
}