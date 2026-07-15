import { IGetProviderPayoutRequestsUseCase } from "../../../../domain/interfaces/usecases/provider/payout/IGetProviderPayoutRequestsUseCase";
import { IPayoutRequestRepository } from "../../../../domain/interfaces/repositories/payout-request/IPayoutRequestRepository";
import { PayoutRequest } from "../../../../domain/entities/payout-request.entity";

export class GetProviderPayoutRequestsUseCase implements IGetProviderPayoutRequestsUseCase {
  constructor(
    private readonly payoutRequestRepository: IPayoutRequestRepository
  ) {}

  async execute(providerId: string): Promise<PayoutRequest[]> {
    return this.payoutRequestRepository.findByProviderId(providerId);
  }
}
