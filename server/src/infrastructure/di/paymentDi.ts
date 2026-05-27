import { ConfirmPaymentUseCase } from "../../application/use-cases/payment/confirm-payment.use-case";
import { StripeWebhookController } from "../../presentation/controllers/webhook/stripe-webhook.controller";
import { StripeService } from "../external-services/stripe/stripe.service";
import { MongoTransactionManager } from "../persistence/mongodb/mongo-transaction.manager";
import { BookingRepository } from "../persistence/mongodb/repositories/booking.repository";
import { PaymentRepository } from "../persistence/mongodb/repositories/payment.repository";

const stripeService = new StripeService();

const paymentRepository = new PaymentRepository();

const bookingRepository = new BookingRepository();
const transactionManager = new MongoTransactionManager();

const confirmPaymentUseCase = new ConfirmPaymentUseCase(
  paymentRepository,

  bookingRepository,

  transactionManager,
);

export const stripeWebhookController = new StripeWebhookController(
  stripeService,

  confirmPaymentUseCase,
);
