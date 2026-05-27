import { SubscriptionPlan } from "../../../entities/subscription-plan.entity";
import { IBaseRepository } from "../base/IBaseRepository";
import { ITransactionContext } from "../../database/transaction-context.interface";

export interface ISubscriptionPlanRepository
  extends IBaseRepository<SubscriptionPlan> {
  findActivePlans(
    transaction?: ITransactionContext,
  ): Promise<SubscriptionPlan[]>;
  findByName(
    name: string,
    transaction?: ITransactionContext,
  ): Promise<SubscriptionPlan | null>;
}
