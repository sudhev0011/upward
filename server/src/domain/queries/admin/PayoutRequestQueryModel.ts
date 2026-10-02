import { PayoutRequest } from "../../entities/payout-request.entity";
import { ProviderBank } from "../../entities/provider-bank.entity";
import { PaginatedResult } from "../../common.types";

export interface PayoutRequestQueryModel {
  payoutRequest: PayoutRequest;
  provider: {
    name: string;
    email: string;
  };
  bankDetails: ProviderBank | null;
}

export type AdminPayoutRequestResponse = PayoutRequestQueryModel;

export interface PaginatedPayoutRequestsResponse
  extends PaginatedResult<PayoutRequestQueryModel> {}

export interface PayoutRequestPaginationOptions {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
}
