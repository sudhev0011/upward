import { ProviderSubscription } from "../../../entities/provider-subscription.entity";
import { IBaseRepository } from "../base/IBaseRepository";
import { ITransactionContext } from "../../database/transaction-context.interface";
import { PlanFeatures } from "../../subscription-plan.interface";

export interface IProviderSubscriptionRepository extends IBaseRepository<ProviderSubscription> {
  findByStripePaymentIntentId(
    stripePaymentIntentId: string,
    transaction?: ITransactionContext,
  ): Promise<ProviderSubscription | null>;

  findActiveSubscriptionByProviderId(
    providerId: string,
    transaction?: ITransactionContext,
  ): Promise<ProviderSubscription | null>;

  findByProviderId(
    providerId: string,
    transaction?: ITransactionContext,
  ): Promise<ProviderSubscription[]>;

  getActivePlanLimitsByProvider(
    providerId: string,
    transaction?: ITransactionContext,
  ): Promise<PlanFeatures>;
}
