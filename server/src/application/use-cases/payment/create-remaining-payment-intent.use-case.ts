import { Payment } from "../../../domain/entities/payment.entity";
import { PaymentType } from "../../../domain/enums/payment-type.enum";
import { ConflictError, NotFoundError } from "../../../domain/errors/errors";
import { ITransactionManager } from "../../../domain/interfaces/database/transaction-manager.interface";
import { IBookingRepository } from "../../../domain/interfaces/repositories/booking/IBookingRepository";
import { IPaymentRepository } from "../../../domain/interfaces/repositories/payment/IPaymentRepository";
import { IPaymentGateway } from "../../../domain/interfaces/services/payment/IPaymentGateway";
import { ICreateRemainingPaymentIntentUseCase } from "../../../domain/interfaces/usecases/payment/ICreateRemainingPaymentIntentUseCase";
import { CreateRemainingPaymentIntentRequestDto } from "../../dtos/client/payment/create-remaining-payment-intent-request.dto";
import { CreateRemainingPaymentIntentResponseDto } from "../../dtos/client/payment/create-remaining-payment-intent-response.dto";

export class CreateRemainingPaymentIntentUseCase
  implements ICreateRemainingPaymentIntentUseCase
{
  constructor(
    private readonly bookingRepository: IBookingRepository,
    private readonly paymentRepository: IPaymentRepository,
    private readonly paymentGateway: IPaymentGateway,
    private readonly transactionManager: ITransactionManager,
  ) {}

  async execute(
    clientId: string,
    data: CreateRemainingPaymentIntentRequestDto,
  ): Promise<CreateRemainingPaymentIntentResponseDto> {
    /**
     * STEP 1
     * Find confirmed partial booking owned by this client
     * Method validates: status=CONFIRMED, paymentType=PARTIAL, paymentStatus=PARTIALLY_PAID
     */

    const booking =
      await this.bookingRepository.findConfirmedPartialBookingByIdAndClientId(
        data.bookingId,
        clientId,
      );

    if (!booking) {
      throw new NotFoundError(
        "No eligible booking found for remaining payment",
      );
    }

    /**
     * STEP 2
     * Guard — remaining amount must be positive
     * Extra safety beyond what the repository filter already guarantees
     */

    if (booking.remainingAmount <= 0) {
      throw new ConflictError("This booking has no remaining amount to pay");
    }

    /**
     * STEP 3
     * Prevent duplicate pending remaining payments
     * Same deduplication pattern as CreatePaymentIntentUseCase
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
     * STEP 4
     * Amount is the remaining balance
     */

    const amount = booking.remainingAmount;

    /**
     * STEP 5
     * Create new payment entity for the remaining amount
     * paymentType "full" marks this as the completing payment
     */

    const payment = Payment.create({
      bookingId: booking.id!,
      clientId: booking.clientId,
      providerId: booking.providerId,
      amount,
      currency: "inr",
      paymentType: PaymentType.FULL,
    });

    /**
     * STEP 6
     * Transaction — persist payment, create stripe intent, attach intent id
     */

    return this.transactionManager.runInTransaction(async (transaction) => {
      /**
       * Persist payment document
       */

      const createdPayment = await this.paymentRepository.create(
        payment,
        transaction,
      );

      /**
       * Create Stripe PaymentIntent with type=remaining in metadata
       * Webhook uses this to route to ConfirmRemainingPaymentUseCase
       */

      const paymentIntent = await this.paymentGateway.createPaymentIntent({
        amount,
        currency: "inr",
        metadata: {
          bookingId: booking.id!,
          paymentId: createdPayment.id!,
          clientId,
          type: "remaining",
        },
      });

      /**
       * Attach Stripe PaymentIntent ID to payment document
       */

      const updatedPayment = createdPayment.attachStripePaymentIntent(
        paymentIntent.paymentIntentId,
      );

      await this.paymentRepository.update(
        createdPayment.id!,
        updatedPayment,
        transaction,
      );

      return {
        paymentId: createdPayment.id!,
        paymentIntentId: paymentIntent.paymentIntentId,
        clientSecret: paymentIntent.clientSecret,
      };
    });
  }
}