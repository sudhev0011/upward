import { ProviderSubscription } from "../../../../../domain/entities/provider-subscription.entity";

export interface CreateSubscriptionCheckoutResponse {
  clientSecret: string;
  subscription: ProviderSubscription;
}