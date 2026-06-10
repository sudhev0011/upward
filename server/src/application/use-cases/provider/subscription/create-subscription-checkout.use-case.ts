import { ProviderSubscription } from "../../../../domain/entities/provider-subscription.entity";
import { NotFoundError } from "../../../../domain/errors/errors";
import { ISubscriptionPlanRepository } from "../../../../domain/interfaces/repositories/subscription-plan/ISubscriptionPlanRepository";
import { IProviderSubscriptionRepository } from "../../../../domain/interfaces/repositories/provider-subscription/IProviderSubscriptionRepository";
import { IPaymentGateway } from "../../../../domain/interfaces/services/payment/IPaymentGateway";

export interface CreateSubscriptionCheckoutRequest {
  providerId: string;
  planId: string;
}

export interface CreateSubscriptionCheckoutResponse {
  clientSecret: string;
  subscription: ProviderSubscription;
}

export class CreateSubscriptionCheckoutUseCase {
  constructor(
    private readonly subscriptionPlanRepository: ISubscriptionPlanRepository,
    private readonly providerSubscriptionRepository: IProviderSubscriptionRepository,
    private readonly paymentGateway: IPaymentGateway,
  ) {}

  async execute(
    data: CreateSubscriptionCheckoutRequest,
  ): Promise<CreateSubscriptionCheckoutResponse> {
    const plan = await this.subscriptionPlanRepository.findById(data.planId);

    if (!plan || !plan.isActive) {
      throw new NotFoundError("Active subscription plan not found");
    }

    const subscription = ProviderSubscription.create({
      id: "", 
      providerId: data.providerId,
      planId: plan.id,
      amount: plan.price,
      status: "pending",
      startDate: null,
      endDate: null,
      stripePaymentIntentId: null,
    });

    const createdSubscription =
      await this.providerSubscriptionRepository.create(subscription);

    const stripeResult = await this.paymentGateway.createPaymentIntent({
      amount: plan.price,
      currency: "inr",
      metadata: {
        type: "subscription",
        subscriptionId: createdSubscription.id,
      },
    });

    const updatedSubscription = ProviderSubscription.create({
      id: createdSubscription.id,
      providerId: createdSubscription.providerId,
      planId: createdSubscription.planId,
      amount: createdSubscription.amount,
      status: createdSubscription.status,
      startDate: createdSubscription.startDate,
      endDate: createdSubscription.endDate,
      stripePaymentIntentId: stripeResult.paymentIntentId,
      createdAt: createdSubscription.createdAt,
      updatedAt: new Date(),
    });

    await this.providerSubscriptionRepository.update(
      createdSubscription.id,
      updatedSubscription,
    );

    return {
      clientSecret: stripeResult.clientSecret,
      subscription: updatedSubscription,
    };
  }
}
