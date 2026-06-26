import { InternalServerError } from "../../domain/errors/errors";
import { UserRole } from "../../domain/enums/user-role.enum";
import { WalletTransactionCategory } from "../../domain/enums/wallet-transaction-category.enum";
import { IWalletRepository } from "../../domain/interfaces/repositories/wallet/IWalletRepository";
import { IWalletTransactionRepository } from "../../domain/interfaces/repositories/wallet/IWalletTransactionRepository";
import { IPlatformWalletService } from "../../domain/interfaces/services/payment/IPlatformWalletService";
import { IUserRepository } from "../../domain/interfaces/repositories/user/IUserRepository";
import { ITransactionContext } from "../../domain/interfaces/database/transaction-context.interface";
import { WalletTransaction } from "../../domain/entities/wallet-transaction.entity";
import { WalletTransactionType } from "../../domain/enums/wallet-transaction.type.enum";

export class PlatformWalletService implements IPlatformWalletService {
  constructor(
    private readonly userRepository: IUserRepository,

    private readonly walletRepository: IWalletRepository,

    private readonly walletTransactionRepository: IWalletTransactionRepository,
  ) {}

  async credit(
    amount: number,
    bookingId: string | null,
    description: string,
    category: WalletTransactionCategory,
    transaction?: ITransactionContext,
  ): Promise<void> {
    const platformWallet = await this.getPlatformWallet();
    
    const updatedWallet = platformWallet.credit(amount);

    await this.walletRepository.update(
      updatedWallet.id!,
      updatedWallet,
      transaction,
    );

    const walletTransaction = WalletTransaction.create({
      walletId: platformWallet.id!,

      amount,

      type: WalletTransactionType.CREDIT,

      category,

      description,

      bookingId,
    });

    await this.walletTransactionRepository.create(
      walletTransaction,
      transaction,
    );
  }

  async debit(
    amount: number,
    bookingId: string | null,
    description: string,
    category: WalletTransactionCategory,
    transaction?: ITransactionContext,
  ): Promise<void> {
    const platformWallet = await this.getPlatformWallet();

    const updatedWallet = platformWallet.debit(amount);

    await this.walletRepository.update(
      updatedWallet.id!,
      updatedWallet,
      transaction,
    );

    const walletTransaction = WalletTransaction.create({
      walletId: platformWallet.id!,

      amount,

      type: WalletTransactionType.DEBIT,

      category,

      description,

      bookingId,
    });

    await this.walletTransactionRepository.create(
      walletTransaction,
      transaction,
    );
  }

  private async getPlatformWallet() {
    const systemUser = await this.userRepository.findOne({
      roles: UserRole.SYSTEM,
    });

    if (!systemUser) {
      throw new InternalServerError("Platform user not found");
    }

    const wallet = await this.walletRepository.findByUserId(systemUser.id!);

    if (!wallet) {
      throw new InternalServerError("Platform wallet not found");
    }

    return wallet;
  }
}
