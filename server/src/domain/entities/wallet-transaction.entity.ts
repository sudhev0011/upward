import { WalletTransactionCategory } from "../enums/wallet-transaction-category.enum";
import { WalletTransactionType } from "../enums/wallet-transaction.type.enum";

export class WalletTransaction {
  constructor(
    public readonly id: string | undefined,
    public readonly walletId: string,
    public readonly amount: number,
    public readonly type: WalletTransactionType,
    public readonly category: WalletTransactionCategory,
    public readonly description: string,
    public readonly bookingId: string | null,
    public readonly createdAt: Date,
  ) {}

  static create(data: {
    id?: string;
    walletId: string;
    amount: number;
    type: WalletTransactionType;
    category: WalletTransactionCategory;
    description: string;
    bookingId?: string | null;
    createdAt?: Date;
  }): WalletTransaction {
    return new WalletTransaction(
      data.id,
      data.walletId,
      data.amount,
      data.type,
      data.category,
      data.description,
      data.bookingId ?? null,
      data.createdAt ?? new Date(),
    );
  }
}
