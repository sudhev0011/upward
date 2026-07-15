import { ICreatePayoutRequestUseCase } from "../../../../domain/interfaces/usecases/provider/payout/ICreatePayoutRequestUseCase";
import { IPayoutRequestRepository } from "../../../../domain/interfaces/repositories/payout-request/IPayoutRequestRepository";
import { IWalletRepository } from "../../../../domain/interfaces/repositories/wallet/IWalletRepository";
import { IWalletTransactionRepository } from "../../../../domain/interfaces/repositories/wallet/IWalletTransactionRepository";
import { IProviderBankRepository } from "../../../../domain/interfaces/repositories/provider/IProviderBankRepository";
import { ITransactionManager } from "../../../../domain/interfaces/database/transaction-manager.interface";
import { PayoutRequest } from "../../../../domain/entities/payout-request.entity";
import { WalletTransaction } from "../../../../domain/entities/wallet-transaction.entity";
import { WalletTransactionType } from "../../../../domain/enums/wallet-transaction.type.enum";
import { WalletTransactionCategory } from "../../../../domain/enums/wallet-transaction-category.enum";
import { NotFoundError, ValidationError, UnprocessableEntityError } from "../../../../domain/errors/errors";

export class CreatePayoutRequestUseCase implements ICreatePayoutRequestUseCase {
  constructor(
    private readonly payoutRequestRepository: IPayoutRequestRepository,
    private readonly walletRepository: IWalletRepository,
    private readonly walletTransactionRepository: IWalletTransactionRepository,
    private readonly providerBankRepository: IProviderBankRepository,
    private readonly transactionManager: ITransactionManager
  ) {}

  async execute(providerId: string, amount: number): Promise<void> {
    if (amount <= 0) {
      throw new ValidationError("Withdrawal amount must be greater than zero");
    }

    // 1. Verify provider has submitted bank details
    const bankDetails = await this.providerBankRepository.findByProviderId(providerId);
    if (!bankDetails || bankDetails.status !== "approved") {
      throw new UnprocessableEntityError("You must have approved bank details to request a payout");
    }

    // 2. Load provider wallet
    const wallet = await this.walletRepository.findByUserId(providerId);
    if (!wallet) {
      throw new NotFoundError("Provider wallet not found");
    }

    // 3. Verify sufficient balance
    if (wallet.balance < amount) {
      throw new ValidationError("Insufficient wallet balance for withdrawal");
    }

    // 4. Perform debit and create request in transaction
    await this.transactionManager.runInTransaction(async (transaction) => {
      const updatedWallet = wallet.debit(amount);
      await this.walletRepository.update(wallet.id!, updatedWallet, transaction);

      const walletTx = WalletTransaction.create({
        walletId: wallet.id!,
        amount,
        type: WalletTransactionType.DEBIT,
        category: WalletTransactionCategory.PROVIDER_PAYOUT,
        description: "Payout withdrawal request pending approval",
        bookingId: null,
      });
      await this.walletTransactionRepository.create(walletTx, transaction);

      const payoutRequest = PayoutRequest.create({
        providerId,
        amount,
        status: "pending",
      });
      await this.payoutRequestRepository.create(payoutRequest, transaction);
    });
  }
}
