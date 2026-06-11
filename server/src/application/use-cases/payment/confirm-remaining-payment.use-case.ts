import { PaymentTransactionStatus } from "../../../domain/enums/payment-transaction-status.enum";
import { NotFoundError, UnprocessableEntityError } from "../../../domain/errors/errors";
import { ITransactionManager } from "../../../domain/interfaces/database/transaction-manager.interface";
import { IBookingRepository } from "../../../domain/interfaces/repositories/booking/IBookingRepository";
import { IPaymentRepository } from "../../../domain/interfaces/repositories/payment/IPaymentRepository";
import { INotificationService } from "../../../domain/interfaces/services/INotificationService";
import { IConfirmRemainingPaymentUseCase } from "../../../domain/interfaces/usecases/payment/IConfirmRemainingPaymentUseCase";

export class ConfirmRemainingPaymentUseCase
  implements IConfirmRemainingPaymentUseCase
{
  constructor(
    private readonly paymentRepository: IPaymentRepository,
    private readonly bookingRepository: IBookingRepository,
    private readonly transactionManager: ITransactionManager,
    private readonly notificationService: INotificationService,
  ) {}

  async execute(stripePaymentIntentId: string): Promise<void> {
    /**
     * STEP 1
     * Find payment by stripe intent id
     */

    const payment = await this.paymentRepository.findByStripePaymentIntentId(
      stripePaymentIntentId,
    );

    if (!payment) {
      throw new NotFoundError("Payment not found");
    }

    /**
     * STEP 2
     * Idempotency — webhook may fire more than once
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
     * Guard — booking must still be partially paid
     */

    if (booking.remainingAmount <= 0) {
      throw new UnprocessableEntityError(
        "Booking already fully paid",
      );
    }

    /**
     * STEP 5
     * Transactional update — mark payment succeeded, mark booking fully paid
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
       * Mark booking fully paid
       */

      const fullyPaidBooking = booking.markFullyPaid();

      await this.bookingRepository.update(
        booking.id!,
        fullyPaidBooking,
        transaction,
      );
    });

    /**
     * STEP 6
     * Notify client that remaining payment was received
     */

    await this.notificationService.sendNotification({
      recipientId: booking.clientId,
      title: "Payment confirmed",
      message: "Your remaining payment has been received. Your booking is now fully paid.",
      type: "booking",
      data: { bookingId: booking.bookingId },
    });
  }
}