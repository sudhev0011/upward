import { WalletTransaction } from "../../../domain/entities/wallet-transaction.entity";
import { Wallet } from "../../../domain/entities/wallet.entity";
import { BookingStatus } from "../../../domain/enums/booking-status.enum";
import { PaymentStatus } from "../../../domain/enums/payment-status.enum";
import { WalletTransactionCategory } from "../../../domain/enums/wallet-transaction-category.enum";
import { WalletTransactionType } from "../../../domain/enums/wallet-transaction.type.enum";
import { NotFoundError, ValidationError } from "../../../domain/errors/errors";
import { ITransactionManager } from "../../../domain/interfaces/database/transaction-manager.interface";
import { IBookingRepository } from "../../../domain/interfaces/repositories/booking/IBookingRepository";
import { IWalletRepository } from "../../../domain/interfaces/repositories/wallet/IWalletRepository";
import { IWalletTransactionRepository } from "../../../domain/interfaces/repositories/wallet/IWalletTransactionRepository";
import { ICommissionCalculationService } from "../../../domain/interfaces/services/payment/ICommissionCalculationService";
import { IPlatformWalletService } from "../../../domain/interfaces/services/payment/IPlatformWalletService";
import { IReleaseProviderPayoutUseCase } from "../../../domain/interfaces/usecases/payment/IReleaseProviderPayoutUseCase";

export class ReleaseProviderPayoutUseCase implements IReleaseProviderPayoutUseCase {
  constructor(
    private readonly bookingRepository: IBookingRepository,

    private readonly walletRepository: IWalletRepository,

    private readonly walletTransactionRepository: IWalletTransactionRepository,

    private readonly platformWalletService: IPlatformWalletService,

    private readonly commissionCalculationService: ICommissionCalculationService,

    private readonly transactionManager: ITransactionManager,
  ) {}

  async execute(bookingId: string): Promise<void> {
    const booking = await this.bookingRepository.findById(bookingId);

    if (!booking) {
      throw new NotFoundError("Booking not found");
    }

    if (booking.status !== BookingStatus.CLIENT_COMPLETED) {
      throw new ValidationError("Booking is not ready for payout");
    }

    if (booking.paymentStatus !== PaymentStatus.PAID) {
      throw new ValidationError("Booking payment is not completed");
    }

    const breakdown = this.commissionCalculationService.calculate(
      booking.totalAmount,
    );

    let providerWallet = await this.walletRepository.findByUserId(
      booking.providerId,
    );

    if (!providerWallet) {
      providerWallet = await this.walletRepository.create(
        Wallet.create({ userId: booking.providerId, balance: 0 }),
      );
    }

    await this.transactionManager.runInTransaction(async (transaction) => {
      /**
       * Debit platform wallet
       */

      await this.platformWalletService.debit(
        breakdown.providerAmount,

        booking.id!,

        `Provider payout for booking ${booking.bookingId}`,

        WalletTransactionCategory.PROVIDER_PAYOUT,

        transaction,
      );

      /**
       * Credit provider wallet
       */

      const updatedProviderWallet = providerWallet.credit(
        breakdown.providerAmount,
      );

      await this.walletRepository.update(
        updatedProviderWallet.id!,

        updatedProviderWallet,

        transaction,
      );

      /**
       * Provider transaction
       */

      const providerTransaction = WalletTransaction.create({
        walletId: providerWallet.id!,

        amount: breakdown.providerAmount,

        type: WalletTransactionType.CREDIT,

        category: WalletTransactionCategory.PROVIDER_PAYOUT,

        description: `Booking earnings for booking ${booking.bookingId}`,

        bookingId: booking.id!,
      });

      await this.walletTransactionRepository.create(
        providerTransaction,
        transaction,
      );

      /**
       * Mark booking completed
       */

      const completedBooking = booking.complete();

      await this.bookingRepository.update(
        booking.id!,

        completedBooking,

        transaction,
      );
    });
  }
}
