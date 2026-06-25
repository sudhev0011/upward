import { WalletTransaction } from "../../../domain/entities/wallet-transaction.entity";
import { PaymentTransactionStatus } from "../../../domain/enums/payment-transaction-status.enum";
import { UserRole } from "../../../domain/enums/user-role.enum";
import { WalletTransactionCategory } from "../../../domain/enums/wallet-transaction-category.enum";
import { WalletTransactionType } from "../../../domain/enums/wallet-transaction.type.enum";
import { NotFoundError } from "../../../domain/errors/errors";
import { ITransactionManager } from "../../../domain/interfaces/database/transaction-manager.interface";
import { IBookingRepository } from "../../../domain/interfaces/repositories/booking/IBookingRepository";
import { IPaymentRepository } from "../../../domain/interfaces/repositories/payment/IPaymentRepository";
import { IUserRepository } from "../../../domain/interfaces/repositories/user/IUserRepository";
import { IWalletRepository } from "../../../domain/interfaces/repositories/wallet/IWalletRepository";
import { IWalletTransactionRepository } from "../../../domain/interfaces/repositories/wallet/IWalletTransactionRepository";
import { INotificationService } from "../../../domain/interfaces/services/INotificationService";
import { IPlatformWalletService } from "../../../domain/interfaces/services/payment/IPlatformWalletService";
import { IConfirmPaymentUseCase } from "../../../domain/interfaces/usecases/payment/IConfirmPaymentUseCase";

export class ConfirmPaymentUseCase implements IConfirmPaymentUseCase {
  constructor(
    private paymentRepository: IPaymentRepository,

    private bookingRepository: IBookingRepository,

    private transactionManager: ITransactionManager,

    private notificationService: INotificationService,

    private walletRepository: IWalletRepository,

    private walletTransactionRepository: IWalletTransactionRepository,

    private userRepository: IUserRepository,

    private platformWalletService: IPlatformWalletService,
  ) {}

  async execute(stripePaymentIntentId: string): Promise<void> {
    /**
     * STEP 1
     * Find payment
     */

    const payment = await this.paymentRepository.findByStripePaymentIntentId(
      stripePaymentIntentId,
    );

    if (!payment) {
      throw new NotFoundError("Payment not found");
    }

    /**
     * STEP 2
     * Idempotency protection
     */

    if (payment.transactionStatus === PaymentTransactionStatus.SUCCEEDED) {
      return;
    }

    /**
     * STEP 3
     * Find booking
     */

    const booking = await this.bookingRepository.findById(payment.bookingId);

    if (!booking) {
      throw new NotFoundError("Booking not found");
    }

    /**
     * STEP 4
     * Transactional update
     */

    await this.transactionManager.runInTransaction(async (transaction) => {
      /**
       * Mark payment succeeded
       */

      const succeededPayment = payment.markSucceeded(stripePaymentIntentId);

      await this.paymentRepository.update(
        payment.id!,
        succeededPayment,
        transaction,
      );

      /**
       * Credit platform wallet
       */

      await this.platformWalletService.credit(
        payment.amount,

        booking.id!,

        `Booking payment received for booking ${booking.bookingId}`,

        WalletTransactionCategory.BOOKING_PAYMENT,

        transaction,
      );

      /**
       * Confirm booking
       */

      const confirmedBooking = booking.confirm();

      await this.bookingRepository.update(
        booking.id!,

        confirmedBooking,

        transaction,
      );
    });

    await this.notificationService.sendNotification({
      recipientId: booking.providerId,
      title: "New booking",
      message: "A new booking created for you!",
      type: "booking",
      data: { bookingId: booking.bookingId },
    });
  }
}
