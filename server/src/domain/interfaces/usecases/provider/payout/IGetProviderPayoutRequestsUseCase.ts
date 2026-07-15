import { PayoutRequest } from "../../../../entities/payout-request.entity";

export interface IGetProviderPayoutRequestsUseCase {
  execute(providerId: string): Promise<PayoutRequest[]>;
}
