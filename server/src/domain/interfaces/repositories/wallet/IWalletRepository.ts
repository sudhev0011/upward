import { Wallet } from "../../../entities/wallet.entity";
import { IBaseRepository } from "../base/IBaseRepository";
import { ITransactionContext } from "../../database/transaction-context.interface";

export interface IWalletRepository extends IBaseRepository<Wallet> {
  findByUserId(
    userId: string,
    transaction?: ITransactionContext
  ): Promise<Wallet | null>;
}
