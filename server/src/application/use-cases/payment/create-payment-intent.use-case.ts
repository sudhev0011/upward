import { Payment } from "../../../domain/entities/payment.entity";
import {
  NotFoundError,
  UnprocessableEntityError,
} from "../../../domain/errors/errors";
import { ITransactionManager } from "../../../domain/interfaces/database/transaction-manager.interface";
import { IBookingRepository } from "../../../domain/interfaces/repositories/booking/IBookingRepository";
import { IPaymentRepository } from "../../../domain/interfaces/repositories/payment/IPaymentRepository";
import { IPaymentGateway } from "../../../domain/interfaces/services/payment/IPaymentGateway";
import { ICreatePaymentIntentUseCase } from "../../../domain/interfaces/usecases/payment/ICreatePaymentIntentUseCase";
import { CreatePaymentIntentRequestDto } from "../../dtos/client/payment/create-payment-intent-request.dto";
import { CreatePaymentIntentResponseDto } from "../../dtos/client/payment/create-payment-intent-response.dto";

export class CreatePaymentIntentUseCase implements ICreatePaymentIntentUseCase {
  constructor(
    private bookingRepository: IBookingRepository,

    private paymentRepository: IPaymentRepository,

    private paymentGateway: IPaymentGateway,

    private transactionManager: ITransactionManager,
  ) {}

  async execute(
    clientId: string,

    data: CreatePaymentIntentRequestDto,
  ): Promise<CreatePaymentIntentResponseDto> {
    /**
     * STEP 1
     * Validate booking
     */

    const booking =
      await this.bookingRepository.findPendingBookingByIdAndClientId(
        data.bookingId,

        clientId,
      );

    if (!booking) {
      throw new NotFoundError("Pending booking not found");
    }

    /**
     * STEP 2
     * Prevent duplicate pending payments
     */

    const existingPendingPayment =
      await this.paymentRepository.findPendingPaymentByBookingId(booking.id!);

    if (existingPendingPayment) {
      const existingIntent = await this.paymentGateway.retrievePaymentIntent(
        existingPendingPayment.stripePaymentIntentId!,
      );

      if (existingIntent) {
        return {
          paymentId: existingPendingPayment.id!,
          paymentIntentId: existingIntent.paymentIntentId,
          clientSecret: existingIntent.clientSecret,
        };
      }
    }

    /**
     * STEP 3
     * Determine payable amount
     */

    let amount = 0;

    if (booking.paymentType === "full") {
      amount = booking.totalAmount;
    } else {
      amount = booking.paidAmount;
    }

    /**
     * STEP 4
     * Create payment entity
     */

    const payment = Payment.create({
      bookingId: booking.id!,

      clientId: booking.clientId,

      providerId: booking.providerId,

      amount,

      currency: "inr",

      paymentType: booking.paymentType,
    });

    /**
     * STEP 5
     * Transaction flow
     */

    return this.transactionManager.runInTransaction(async (transaction) => {
      /**
       * Persist payment
       */

      const createdPayment = await this.paymentRepository.create(
        payment,

        transaction,
      );

      /**
       * Create Stripe PaymentIntent
       */

      const paymentIntent = await this.paymentGateway.createPaymentIntent({
        amount,

        currency: "inr",

        metadata: {
          bookingId: booking.id!,

          paymentId: createdPayment.id!,

          clientId,
        },
      });

      /**
       * Attach Stripe PaymentIntent ID
       */

      const updatedPayment = createdPayment.attachStripePaymentIntent(
        paymentIntent.paymentIntentId,
      );

      /**
       * Persist updated payment
       */

      await this.paymentRepository.update(
        createdPayment.id!,

        updatedPayment,

        transaction,
      );

      /**
       * Return response
       */

      return {
        paymentId: createdPayment.id!,

        paymentIntentId: paymentIntent.paymentIntentId,

        clientSecret: paymentIntent.clientSecret,
      };
    });
  }
}
