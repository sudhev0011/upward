import { PayoutRequest } from "../../../entities/payout-request.entity";
import { IBaseRepository } from "../base/IBaseRepository";
import { ITransactionContext } from "../../database/transaction-context.interface";

export interface IPayoutRequestRepository extends IBaseRepository<PayoutRequest> {
  findByProviderId(
    providerId: string,
    transaction?: ITransactionContext
  ): Promise<PayoutRequest[]>;
  findAll(
    transaction?: ITransactionContext
  ): Promise<PayoutRequest[]>;
}
