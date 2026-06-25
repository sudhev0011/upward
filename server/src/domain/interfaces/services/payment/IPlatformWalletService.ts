import { WalletTransactionCategory } from "../../../enums/wallet-transaction-category.enum";
import { ITransactionContext } from "../../database/transaction-context.interface";

export interface IPlatformWalletService {
  credit(
    amount: number,
    bookingId: string,
    description: string,
    category: WalletTransactionCategory,
    transaction?: ITransactionContext,
  ): Promise<void>;

  debit(
    amount: number,
    bookingId: string,
    description: string,
    category: WalletTransactionCategory,
    transaction?: ITransactionContext,
  ): Promise<void>;
}