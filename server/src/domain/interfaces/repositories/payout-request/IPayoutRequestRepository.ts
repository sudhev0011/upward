import { PayoutRequest } from "../../../entities/payout-request.entity";
import { IBaseRepository } from "../base/IBaseRepository";
import { ITransactionContext } from "../../database/transaction-context.interface";
import {
  PaginatedPayoutRequestsResponse,
  PayoutRequestPaginationOptions,
} from "../../../queries/admin/PayoutRequestQueryModel";

export interface IPayoutRequestRepository extends IBaseRepository<PayoutRequest> {
  findByProviderId(
    providerId: string,
    transaction?: ITransactionContext
  ): Promise<PayoutRequest[]>;
  findAll(
    options?: PayoutRequestPaginationOptions,
    transaction?: ITransactionContext
  ): Promise<PaginatedPayoutRequestsResponse>;
}

