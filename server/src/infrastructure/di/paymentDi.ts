import { ConfirmPaymentUseCase } from "../../application/use-cases/payment/confirm-payment.use-case";
import { StripeWebhookController } from "../../presentation/controllers/webhook/stripe-webhook.controller";
import { StripeService } from "../external-services/stripe/stripe.service";
import { MongoTransactionManager } from "../persistence/mongodb/mongo-transaction.manager";
import { BookingRepository } from "../persistence/mongodb/repositories/booking.repository";
import { MongoNotificationRepository } from "../persistence/mongodb/repositories/notification.repository";
import { PaymentRepository } from "../persistence/mongodb/repositories/payment.repository";
import { NotificationService } from "../services/notification.service";
import { socketService } from "../services/socket.service";

const stripeService = new StripeService();

const paymentRepository = new PaymentRepository();

const bookingRepository = new BookingRepository();
const transactionManager = new MongoTransactionManager();

const notificationRepository = new MongoNotificationRepository();

export const notificationService = new NotificationService(
  notificationRepository,
  socketService,
);

const confirmPaymentUseCase = new ConfirmPaymentUseCase(
  paymentRepository,

  bookingRepository,

  transactionManager,
  notificationService,
);

export const stripeWebhookController = new StripeWebhookController(
  stripeService,

  confirmPaymentUseCase,
);
