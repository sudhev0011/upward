import { ProviderSubscription } from "../../../../domain/entities/provider-subscription.entity";
import { NotFoundError } from "../../../../domain/errors/errors";
import { ITransactionManager } from "../../../../domain/interfaces/database/transaction-manager.interface";
import { ISubscriptionPlanRepository } from "../../../../domain/interfaces/repositories/subscription-plan/ISubscriptionPlanRepository";
import { IProviderSubscriptionRepository } from "../../../../domain/interfaces/repositories/provider-subscription/IProviderSubscriptionRepository";
import { IProviderProfileRepository } from "../../../../domain/interfaces/repositories/provider/IProviderProfileRepository";
import { ProviderProfile } from "../../../../domain/entities/provider-profile.entity";
import { SubscriptionPlan } from "../../../../domain/entities/subscription-plan.entity";

export class ConfirmSubscriptionPaymentUseCase {
  constructor(
    private readonly subscriptionPlanRepository: ISubscriptionPlanRepository,
    private readonly providerSubscriptionRepository: IProviderSubscriptionRepository,
    private readonly providerProfileRepository: IProviderProfileRepository,
    private readonly transactionManager: ITransactionManager,
  ) {}

  async execute(stripePaymentIntentId: string): Promise<void> {
    const subscription =
      await this.providerSubscriptionRepository.findByStripePaymentIntentId(
        stripePaymentIntentId,
      );

    if (!subscription) {
      throw new NotFoundError("Subscription not found for this payment intent");
    }

    if (subscription.status === "active") {
      return; // Already processed (idempotent)
    }

    const plan = await this.subscriptionPlanRepository.findById(
      subscription.planId,
    );
    if (!plan) {
      throw new NotFoundError("Subscription plan not found");
    }

    const profile = await this.providerProfileRepository.findOne({
      userId: subscription.providerId,
    });
    if (!profile) {
      throw new NotFoundError("Provider profile not found");
    }

    // 1. Calculate subscription dates
    const startDate = new Date();
    const endDate = new Date();
    if (plan.billingCycle === "yearly") {
      endDate.setFullYear(endDate.getFullYear() + 1);
    } else {
      endDate.setMonth(endDate.getMonth() + 1);
    }

    // 2. Perform transactional updates
    await this.transactionManager.runInTransaction(async (transaction) => {
      // A. Activate Subscription
      const activeSubscription = ProviderSubscription.create({
        id: subscription.id,
        providerId: subscription.providerId,
        planId: subscription.planId,
        amount: subscription.amount,
        status: "active",
        startDate,
        endDate,
        stripePaymentIntentId: subscription.stripePaymentIntentId,
        createdAt: subscription.createdAt,
        updatedAt: new Date(),
      });
      await this.providerSubscriptionRepository.update(
        subscription.id,
        activeSubscription,
        transaction,
      );

      // B. Update Provider Profile subscription parameters
      const updatedProfile = ProviderProfile.create({
        id: profile.id,
        userId: profile.userId,
        bio: profile.bio || undefined,
        location: profile.location || undefined,
        phone: profile.phone || undefined,
        avatarUrl: profile.avatarUrl,
        dateOfBirth: profile.dateOfBirth,
        gender: profile.gender,
        skills: profile.skills,
        languages: profile.languages,
        experience: profile.experience,
        ratingCount: profile.ratingCount,
        ratingAvg: profile.ratingAvg,
        isApprovedByAdmin: profile.isApprovedByAdmin,
        socialLinks: profile.socialLinks,
        categories: profile.categories,
        activeSubscriptionExpiresAt: endDate,
        activeSubscriptionPlanName: plan.name,
        createdAt: profile.createdAt,
        updatedAt: new Date(),
      });
      await this.providerProfileRepository.update(
        profile.id,
        updatedProfile,
        transaction,
      );

      // C. Increment plan's subscriberCount
      const updatedPlan = SubscriptionPlan.create({
        id: plan.id,
        name: plan.name,
        price: plan.price,
        billingCycle: plan.billingCycle,
        features: plan.features,
        subscriberCount: plan.subscriberCount + 1,
        isActive: plan.isActive,
        createdAt: plan.createdAt,
        updatedAt: new Date(),
      });
      await this.subscriptionPlanRepository.update(
        plan.id,
        updatedPlan,
        transaction,
      );
    });
  }
}
