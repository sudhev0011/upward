import { ProviderSubscription } from "../../../../domain/entities/provider-subscription.entity";
import { IProviderSubscriptionRepository } from "../../../../domain/interfaces/repositories/provider-subscription/IProviderSubscriptionRepository";
import { IExpireStalePendingSubscriptionsUseCase } from "../../../../domain/interfaces/usecases/subscription/IExpireStalePendingSubscriptionsUseCase";

export class ExpireStalePendingSubscriptionsUseCase
  implements IExpireStalePendingSubscriptionsUseCase
{
  constructor(
    private readonly providerSubscriptionRepository: IProviderSubscriptionRepository,
  ) {}

  async execute(staleAfterMinutes: number = 30): Promise<number> {
    const cutoff = new Date(Date.now() - staleAfterMinutes * 60 * 1000);

    const staleSubscriptions =
      await this.providerSubscriptionRepository.findStalePending(cutoff);

    for (const subscription of staleSubscriptions) {
      const cancelled = ProviderSubscription.create({
        ...subscription,
        status: "cancelled",
        updatedAt: new Date(),
      });
      await this.providerSubscriptionRepository.update(
        subscription.id,
        cancelled,
      );
    }

    return staleSubscriptions.length;
  }
}