import { IWalletRepository } from "../../../domain/interfaces/repositories/wallet/IWalletRepository";
import { IWalletTransactionRepository } from "../../../domain/interfaces/repositories/wallet/IWalletTransactionRepository";
import { Wallet } from "../../../domain/entities/wallet.entity";
import { WalletTransactionType } from "../../../domain/enums/wallet-transaction.type.enum";

export interface WalletTransactionResponse {
  id: string;
  amount: number;
  type: WalletTransactionType;
  description: string;
  bookingId: string | null;
  createdAt: Date;
}

export interface WalletResponse {
  balance: number;
  transactions: WalletTransactionResponse[];
}

export class GetClientWalletUseCase {
  constructor(
    private readonly walletRepository: IWalletRepository,
    private readonly walletTransactionRepository: IWalletTransactionRepository
  ) {}

  async execute(userId: string): Promise<WalletResponse> {
    let wallet = await this.walletRepository.findByUserId(userId);
    if (!wallet) {
      wallet = await this.walletRepository.create(
        Wallet.create({ userId, balance: 0 })
      );
    }

    const transactions = await this.walletTransactionRepository.findByWalletId(
      wallet.id!
    );

    const mappedTransactions: WalletTransactionResponse[] = transactions.map(
      (t) => ({
        id: t.id!,
        amount: t.amount,
        type: t.type,
        description: t.description,
        bookingId: t.bookingId,
        createdAt: t.createdAt,
      })
    );

    mappedTransactions.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    return {
      balance: wallet.balance,
      transactions: mappedTransactions,
    };
  }
}
