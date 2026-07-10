import { NotFoundError } from "../../../../domain/errors/errors";
import { ISubscriptionPlanRepository } from "../../../../domain/interfaces/repositories/subscription-plan/ISubscriptionPlanRepository";
import { IDeleteSubscriptionPlanUseCase } from "../../../../domain/interfaces/usecases/subscription/IDeleteSubscriptionPlanUseCase";

export class DeleteSubscriptionPlanUseCase implements IDeleteSubscriptionPlanUseCase {
  constructor(
    private readonly subscriptionPlanRepository: ISubscriptionPlanRepository,
  ) {}

  async execute(id: string): Promise<void> {
    const plan = await this.subscriptionPlanRepository.findById(id);

    if (!plan) {
      throw new NotFoundError("Subscription plan not found");
    }

    await this.subscriptionPlanRepository.delete(id);
  }
}
