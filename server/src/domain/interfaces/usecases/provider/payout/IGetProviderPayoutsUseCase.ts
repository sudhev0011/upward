import { ProviderPayoutsResponse } from "../../../../../application/use-cases/provider/payout/get-provider-payouts.use-case";

export interface IGetProviderPayoutsUseCase {
  execute(providerId: string): Promise<ProviderPayoutsResponse>;
}
