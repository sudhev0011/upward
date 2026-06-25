import { BookingStatus } from "../../../domain/enums/booking-status.enum";
import { UserRole } from "../../../domain/enums/user-role.enum";
import {
  AuthorizationError,
  NotFoundError,
  UnprocessableEntityError,
  ValidationError,
} from "../../../domain/errors/errors";
import { ITransactionManager } from "../../../domain/interfaces/database/transaction-manager.interface";
import { IBookingRepository } from "../../../domain/interfaces/repositories/booking/IBookingRepository";
import { IUnavailabilityRepository } from "../../../domain/interfaces/repositories/unavailability/IUnavaliability-repository";
import { IWalletRepository } from "../../../domain/interfaces/repositories/wallet/IWalletRepository";
import { IWalletTransactionRepository } from "../../../domain/interfaces/repositories/wallet/IWalletTransactionRepository";
import { Wallet } from "../../../domain/entities/wallet.entity";
import { WalletTransaction } from "../../../domain/entities/wallet-transaction.entity";
import { WalletTransactionType } from "../../../domain/enums/wallet-transaction.type.enum";
import { WalletTransactionCategory } from "../../../domain/enums/wallet-transaction-category.enum";

export class CancelBookingUseCase {
  constructor(
    private readonly bookingRepository: IBookingRepository,
    private readonly unavailabilityRepository: IUnavailabilityRepository,
    private readonly walletRepository: IWalletRepository,
    private readonly walletTransactionRepository: IWalletTransactionRepository,
    private readonly transactionManager: ITransactionManager
  ) {}

  async execute(params: {
    bookingId: string;
    userId: string;
    role: UserRole;
    reason: string | null;
  }): Promise<void> {
    const { bookingId, userId, role, reason } = params;

    const booking = await this.bookingRepository.findById(bookingId);
    if (!booking) {
      throw new NotFoundError("Booking not found");
    }

    if (role === UserRole.CLIENT && booking.clientId !== userId) {
      throw new AuthorizationError("Not authorized to cancel this booking");
    }
    if (role === UserRole.PROVIDER && booking.providerId !== userId) {
      throw new AuthorizationError("Not authorized to cancel this booking");
    }

    if (
      booking.status !== BookingStatus.PENDING &&
      booking.status !== BookingStatus.CONFIRMED
    ) {
      throw new UnprocessableEntityError("Only pending or confirmed bookings can be cancelled");
    }

    if (role === UserRole.CLIENT && booking.status === BookingStatus.CONFIRMED) {
      const now = new Date();
      const timeDifference = new Date(booking?.bookingDate)?.getTime() - now.getTime();
      const oneWeekInMs = 7 * 24 * 60 * 60 * 1000;
      if (timeDifference < oneWeekInMs) {
        throw new ValidationError(
          "Confirmed bookings can only be cancelled at least one week before the scheduled time"
        );
      }
    }

    const refundAmount = booking.paidAmount;

    await this.transactionManager.runInTransaction(async (transaction) => {
      const cancelledBooking = booking.cancel({
        cancelledBy: userId,
        reason,
        refundAmount,
      });

      await this.bookingRepository.update(bookingId, cancelledBooking, transaction);

      await this.unavailabilityRepository.deleteByBookingId(bookingId, transaction);

      if (refundAmount > 0) {
        let wallet = await this.walletRepository.findByUserId(booking.clientId, transaction);
        if (!wallet) {
          wallet = await this.walletRepository.create(
            Wallet.create({ userId: booking.clientId, balance: 0 }),
            transaction
          );
        }

        const updatedWallet = wallet.credit(refundAmount);
        await this.walletRepository.update(wallet.id!, updatedWallet, transaction);

        const walletTransaction = WalletTransaction.create({
          walletId: wallet.id!,
          amount: refundAmount,
          type: WalletTransactionType.CREDIT,
          category: WalletTransactionCategory.REFUND,
          description: `Refund for cancelled booking #${bookingId}${
            reason ? `: ${reason}` : ""
          }`,
          bookingId,
        });
        await this.walletTransactionRepository.create(walletTransaction, transaction);
      }
    });
  }
}
