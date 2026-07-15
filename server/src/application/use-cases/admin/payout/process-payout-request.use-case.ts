import { IProcessPayoutRequestUseCase } from "../../../../domain/interfaces/usecases/admin/payout/IProcessPayoutRequestUseCase";
import { IPayoutRequestRepository } from "../../../../domain/interfaces/repositories/payout-request/IPayoutRequestRepository";
import { IWalletRepository } from "../../../../domain/interfaces/repositories/wallet/IWalletRepository";
import { IWalletTransactionRepository } from "../../../../domain/interfaces/repositories/wallet/IWalletTransactionRepository";
import { ITransactionManager } from "../../../../domain/interfaces/database/transaction-manager.interface";
import { WalletTransaction } from "../../../../domain/entities/wallet-transaction.entity";
import { WalletTransactionType } from "../../../../domain/enums/wallet-transaction.type.enum";
import { WalletTransactionCategory } from "../../../../domain/enums/wallet-transaction-category.enum";
import { NotFoundError, UnprocessableEntityError } from "../../../../domain/errors/errors";

export class ProcessPayoutRequestUseCase implements IProcessPayoutRequestUseCase {
  constructor(
    private readonly payoutRequestRepository: IPayoutRequestRepository,
    private readonly walletRepository: IWalletRepository,
    private readonly walletTransactionRepository: IWalletTransactionRepository,
    private readonly transactionManager: ITransactionManager
  ) {}

  async execute(
    requestId: string,
    status: "transferred" | "rejected",
    adminNotes?: string
  ): Promise<void> {
    const payoutRequest = await this.payoutRequestRepository.findById(requestId);
    if (!payoutRequest) {
      throw new NotFoundError("Payout request not found");
    }

    if (payoutRequest.status !== "pending") {
      throw new UnprocessableEntityError("Only pending payout requests can be processed");
    }

    await this.transactionManager.runInTransaction(async (transaction) => {
      if (status === "rejected") {
        // Find provider's wallet
        const wallet = await this.walletRepository.findByUserId(payoutRequest.providerId);
        if (!wallet) {
          throw new NotFoundError("Provider wallet not found");
        }

        // Refund wallet balance
        const refundedWallet = wallet.credit(payoutRequest.amount);
        await this.walletRepository.update(wallet.id!, refundedWallet, transaction);

        // Record credit transaction
        const walletTx = WalletTransaction.create({
          walletId: wallet.id!,
          amount: payoutRequest.amount,
          type: WalletTransactionType.CREDIT,
          category: WalletTransactionCategory.REFUND,
          description: `Refund for rejected payout request: ${adminNotes || "No reason provided"}`,
          bookingId: null,
        });
        await this.walletTransactionRepository.create(walletTx, transaction);
      }

      // Update payout request status
      const processedRequest = payoutRequest.process(status, adminNotes);
      await this.payoutRequestRepository.update(requestId, processedRequest, transaction);
    });
  }
}
