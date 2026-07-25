import { ProviderSubscription } from "../../../../domain/entities/provider-subscription.entity";
import { NotFoundError, BadRequestError } from "../../../../domain/errors/errors";
import { ISubscriptionPlanRepository } from "../../../../domain/interfaces/repositories/subscription-plan/ISubscriptionPlanRepository";
import { IProviderSubscriptionRepository } from "../../../../domain/interfaces/repositories/provider-subscription/IProviderSubscriptionRepository";
import { IPaymentGateway } from "../../../../domain/interfaces/services/payment/IPaymentGateway";
import { CreateSubscriptionCheckoutResponse } from "../../../dtos/admin/subscription/response/createSubscriptionCheckout.response";
import { CreateSubscriptionUpgradeCheckoutRequest } from "../../../dtos/admin/subscription/request/createSubscriptionUpgradeCheckoutRequest.dto";
import { ICreateSubscriptionUpgradeCheckoutUseCase } from "../../../../domain/interfaces/usecases/subscription/ICreateSubscriptionUpgradeCheckoutUseCase";

export class CreateSubscriptionUpgradeCheckoutUseCase
  implements ICreateSubscriptionUpgradeCheckoutUseCase
{
  constructor(
    private readonly subscriptionPlanRepository: ISubscriptionPlanRepository,
    private readonly providerSubscriptionRepository: IProviderSubscriptionRepository,
    private readonly paymentGateway: IPaymentGateway,
  ) {}

  async execute(
    data: CreateSubscriptionUpgradeCheckoutRequest,
  ): Promise<CreateSubscriptionCheckoutResponse> {
    const currentSubscription =
      await this.providerSubscriptionRepository.findActiveSubscriptionByProviderId(
        data.providerId,
      );

    if (!currentSubscription) {
      throw new NotFoundError(
        "No active subscription found to upgrade from",
      );
    }

    const newPlan = await this.subscriptionPlanRepository.findById(
      data.planId,
    );
    if (!newPlan || !newPlan.isActive) {
      throw new NotFoundError("Active subscription plan not found");
    }

    if (newPlan.id === currentSubscription.planId) {
      throw new BadRequestError("Provider is already on this plan");
    }

    if (newPlan.price <= currentSubscription.amount) {
      throw new BadRequestError(
        "Selected plan is not an upgrade over the current plan",
      );
    }

    const pendingUpgrade = ProviderSubscription.create({
      id: "",
      providerId: data.providerId,
      planId: newPlan.id,
      amount: newPlan.price,
      status: "pending",
      startDate: null,
      endDate: null,
      stripePaymentIntentId: null,
      previousSubscriptionId: currentSubscription.id,
    });

    const createdUpgrade =
      await this.providerSubscriptionRepository.create(pendingUpgrade);

    const stripeResult = await this.paymentGateway.createPaymentIntent({
      amount: newPlan.price,
      currency: "inr",
      metadata: {
        type: "subscription_upgrade",
        subscriptionId: createdUpgrade.id,
        previousSubscriptionId: currentSubscription.id,
      },
    });

    const updatedUpgrade = ProviderSubscription.create({
      ...createdUpgrade,
      stripePaymentIntentId: stripeResult.paymentIntentId,
      updatedAt: new Date(),
    });

    await this.providerSubscriptionRepository.update(
      createdUpgrade.id,
      updatedUpgrade,
    );

    return {
      clientSecret: stripeResult.clientSecret,
      subscription: updatedUpgrade,
    };
  }
}