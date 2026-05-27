import { PaymentTransactionStatus } from "../../../domain/enums/payment-transaction-status.enum";
import { NotFoundError } from "../../../domain/errors/errors";
import { ITransactionManager } from "../../../domain/interfaces/database/transaction-manager.interface";
import { IBookingRepository } from "../../../domain/interfaces/repositories/booking/IBookingRepository";
import { IPaymentRepository } from "../../../domain/interfaces/repositories/payment/IPaymentRepository";
import { IConfirmPaymentUseCase } from "../../../domain/interfaces/usecases/payment/IConfirmPaymentUseCase";

export class ConfirmPaymentUseCase
  implements IConfirmPaymentUseCase
{
  constructor(
    private paymentRepository: IPaymentRepository,

    private bookingRepository: IBookingRepository,

    private transactionManager: ITransactionManager
  ) {}

  async execute(
    stripePaymentIntentId: string
  ): Promise<void> {

    /**
     * STEP 1
     * Find payment
     */

    const payment =
      await this.paymentRepository.findByStripePaymentIntentId(
        stripePaymentIntentId
      );

    if (!payment) {
      throw new NotFoundError(
        "Payment not found"
      );
    }

    /**
     * STEP 2
     * Idempotency protection
     */

    if (
      payment.transactionStatus ===
      PaymentTransactionStatus.SUCCEEDED
    ) {
      return;
    }

    /**
     * STEP 3
     * Find booking
     */

    const booking =
      await this.bookingRepository.findById(
        payment.bookingId
      );

    if (!booking) {
      throw new NotFoundError(
        "Booking not found"
      );
    }

    /**
     * STEP 4
     * Transactional update
     */

    await this.transactionManager.runInTransaction(
      async (transaction) => {

        /**
         * Mark payment succeeded
         */

        const succeededPayment =
          payment.markSucceeded(
            stripePaymentIntentId
          );

        await this.paymentRepository.update(
          payment.id!,

          succeededPayment,

          transaction
        );

        /**
         * Confirm booking
         */

        const confirmedBooking =
          booking.confirm();
        await this.bookingRepository.update(
          booking.id!,

          confirmedBooking,

          transaction
        );
      }
    );
  }
}