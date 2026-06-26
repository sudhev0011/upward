import { ConfirmPaymentUseCase } from "../../application/use-cases/payment/confirm-payment.use-case";
import { StripeWebhookController } from "../../presentation/controllers/webhook/stripe-webhook.controller";
import { StripeService } from "../external-services/stripe/stripe.service";
import { MongoTransactionManager } from "../persistence/mongodb/mongo-transaction.manager";
import { BookingRepository } from "../persistence/mongodb/repositories/booking.repository";
import { MongoNotificationRepository } from "../persistence/mongodb/repositories/notification.repository";
import { PaymentRepository } from "../persistence/mongodb/repositories/payment.repository";
import { NotificationService } from "../services/notification.service";
import { socketService } from "../services/socket.service";
import { ConfirmRemainingPaymentUseCase } from "../../application/use-cases/payment/confirm-remaining-payment.use-case";
import { IConfirmRemainingPaymentUseCase } from "../../domain/interfaces/usecases/payment/IConfirmRemainingPaymentUseCase";
import { firebasePushNotificationService } from "./notificationDi";
import { walletRepository } from "./clientDi";
import { walletTransactionRepository } from "./clientDi";
import { userRepository } from "./authDi";
import { PlatformWalletService } from "../../application/services/platform-wallet.service";
import { ReleaseProviderPayoutUseCase } from "../../application/use-cases/payment/release-provider-payout.use-case";
import { CommissionCalculationService } from "../../application/services/commission-calculation.service";
import { ProcessProviderPayoutsUseCase } from "../../application/use-cases/payment/process-provider-payouts.use-case";
const stripeService = new StripeService();

const paymentRepository = new PaymentRepository();

const bookingRepository = new BookingRepository();
const transactionManager = new MongoTransactionManager();

const notificationRepository = new MongoNotificationRepository();

export const notificationService = new NotificationService(
  notificationRepository,
  socketService,
  firebasePushNotificationService,
);

export const platformWalletService = new PlatformWalletService(
  userRepository,
  walletRepository,
  walletTransactionRepository,
);

const commissionCalculationService = new CommissionCalculationService();

const confirmPaymentUseCase = new ConfirmPaymentUseCase(
  paymentRepository,

  bookingRepository,

  transactionManager,

  notificationService,

  walletRepository,

  walletTransactionRepository,

  userRepository,

  platformWalletService,
);

export const releaseProviderPayoutUseCase = new ReleaseProviderPayoutUseCase(
  bookingRepository,
  walletRepository,
  walletTransactionRepository,
  platformWalletService,
  commissionCalculationService,
  transactionManager,
);

export const processProviderPayoutsUseCase = new ProcessProviderPayoutsUseCase(bookingRepository,releaseProviderPayoutUseCase)

const confirmRemainingPaymentUseCase: IConfirmRemainingPaymentUseCase =
  new ConfirmRemainingPaymentUseCase(
    paymentRepository,
    bookingRepository,
    transactionManager,
    notificationService,
    platformWalletService,
  );

export const stripeWebhookController = new StripeWebhookController(
  stripeService,

  confirmPaymentUseCase,

  confirmRemainingPaymentUseCase,
);
