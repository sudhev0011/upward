import { PayoutRequest } from "../../../../entities/payout-request.entity";
import { ProviderBank } from "../../../../entities/provider-bank.entity";

export interface AdminPayoutRequestResponse {
  payoutRequest: PayoutRequest;
  provider: {
    name: string;
    email: string;
  };
  bankDetails: ProviderBank | null;
}

export interface IGetAdminPayoutRequestsUseCase {
  execute(): Promise<AdminPayoutRequestResponse[]>;
}
