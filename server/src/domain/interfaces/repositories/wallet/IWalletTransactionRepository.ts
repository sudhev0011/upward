import { WalletTransaction } from "../../../entities/wallet-transaction.entity";
import { IBaseRepository } from "../base/IBaseRepository";
import { ITransactionContext } from "../../database/transaction-context.interface";

export interface IWalletTransactionRepository extends IBaseRepository<WalletTransaction> {
  findByWalletId(
    walletId: string,
    transaction?: ITransactionContext
  ): Promise<WalletTransaction[]>;
}
