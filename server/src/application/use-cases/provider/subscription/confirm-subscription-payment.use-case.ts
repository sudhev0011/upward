import { ProviderSubscription } from "../../../../domain/entities/provider-subscription.entity";
import { NotFoundError } from "../../../../domain/errors/errors";
import { ITransactionManager } from "../../../../domain/interfaces/database/transaction-manager.interface";
import { ISubscriptionPlanRepository } from "../../../../domain/interfaces/repositories/subscription-plan/ISubscriptionPlanRepository";
import { IProviderSubscriptionRepository } from "../../../../domain/interfaces/repositories/provider-subscription/IProviderSubscriptionRepository";
import { IProviderProfileRepository } from "../../../../domain/interfaces/repositories/provider/IProviderProfileRepository";
import { ProviderProfile } from "../../../../domain/entities/provider-profile.entity";
import { SubscriptionPlan } from "../../../../domain/entities/subscription-plan.entity";
import { IPlatformWalletService } from "../../../../domain/interfaces/services/payment/IPlatformWalletService";
import { WalletTransactionCategory } from "../../../../domain/enums/wallet-transaction-category.enum";

export class ConfirmSubscriptionPaymentUseCase {
  constructor(
    private readonly subscriptionPlanRepository: ISubscriptionPlanRepository,
    private readonly providerSubscriptionRepository: IProviderSubscriptionRepository,
    private readonly providerProfileRepository: IProviderProfileRepository,
    private readonly platformWalletService: IPlatformWalletService,
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
      return;
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

    let previousSubscription: ProviderSubscription | null = null;
    let previousPlan: SubscriptionPlan | null = null;
    if (subscription.previousSubscriptionId) {
      previousSubscription = await this.providerSubscriptionRepository.findById(
        subscription.previousSubscriptionId,
      );
      if (previousSubscription) {
        previousPlan = await this.subscriptionPlanRepository.findById(
          previousSubscription.planId,
        );
      }
    }

    const startDate = new Date();
    const endDate = new Date();
    if (plan.billingCycle === "yearly") {
      endDate.setFullYear(endDate.getFullYear() + 1);
    } else {
      endDate.setMonth(endDate.getMonth() + 1);
    }

    await this.transactionManager.runInTransaction(async (transaction) => {
      // Credit platform wallet
      await this.platformWalletService.credit(
        subscription.amount,
        null,
        `Provider subscription payment received for plan ${plan.name}`,
        WalletTransactionCategory.SUBSCRIPTION_PAYMENT,
        transaction,
      );

      const activeSubscription = ProviderSubscription.create({
        ...subscription,
        status: "active",
        startDate,
        endDate,
        updatedAt: new Date(),
      });
      await this.providerSubscriptionRepository.update(
        subscription.id,
        activeSubscription,
        transaction,
      );

      if (previousSubscription) {
        const cancelledSubscription = ProviderSubscription.create({
          ...previousSubscription,
          status: "cancelled",
          updatedAt: new Date(),
        });
        await this.providerSubscriptionRepository.update(
          previousSubscription.id,
          cancelledSubscription,
          transaction,
        );

        // Old plan loses a subscriber
        if (previousPlan) {
          const updatedOldPlan = SubscriptionPlan.create({
            ...previousPlan,
            subscriberCount: Math.max(0, previousPlan.subscriberCount - 1),
            updatedAt: new Date(),
          });
          await this.subscriptionPlanRepository.update(
            previousPlan.id,
            updatedOldPlan,
            transaction,
          );
        }
      }

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
        activeSubscriptionPlanId: plan.id,
        createdAt: profile.createdAt,
        updatedAt: new Date(),
      });
      await this.providerProfileRepository.update(
        profile.id,
        updatedProfile,
        transaction,
      );

      const updatedPlan = SubscriptionPlan.create({
        ...plan,
        subscriberCount: plan.subscriberCount + 1,
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
