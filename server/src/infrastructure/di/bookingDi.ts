import { ExpirePendingBookingsUseCase } from "../../application/use-cases/booking/expire-pending-booking.use-case";
import { ListBookingsUseCase } from "../../application/use-cases/booking/list-booking-use-case";
import { MongoTransactionManager } from "../persistence/mongodb/mongo-transaction.manager";
import { BookingRepository } from "../persistence/mongodb/repositories/booking.repository";
import { UnavailabilityRepository } from "../persistence/mongodb/repositories/unavailability.repository";
import { WalletRepository } from "../persistence/mongodb/repositories/wallet.repository";
import { WalletTransactionRepository } from "../persistence/mongodb/repositories/wallet-transaction.repository";
import { CancelBookingUseCase } from "../../application/use-cases/booking/cancel-booking.use-case";
import { ProviderServiceRepository } from "../persistence/mongodb/repositories/provider-service.repository";
import { OffsiteCapacityValidationService } from "../../application/services/offsite-capacity-validation.service";
import { CreateOffsiteBookingUseCase } from "../../application/use-cases/booking/create-offsite-booking-use-case";
import { NanoIdBookingIdtor } from "../services/NanoIdBookingNumberGenerator";

const bookingRepository = new BookingRepository();
const providerServiceRepository = new ProviderServiceRepository();
const unavailabilityRepository = new UnavailabilityRepository();
const walletRepository = new WalletRepository();
const walletTransactionRepository = new WalletTransactionRepository();
const transactionManager = new MongoTransactionManager();
const bookingIdGenerator = new NanoIdBookingIdtor();

export const offsiteCapacityValidationService = new OffsiteCapacityValidationService(
  providerServiceRepository,
  bookingRepository,
);

export const expirePendingBookingsUseCase = new ExpirePendingBookingsUseCase(
  bookingRepository,
  unavailabilityRepository,
  transactionManager,
);
export const listBookingUseCase = new ListBookingsUseCase(bookingRepository);
export const cancelBookingUseCase = new CancelBookingUseCase(
  bookingRepository,
  unavailabilityRepository,
  walletRepository,
  walletTransactionRepository,
  transactionManager,
);

export const createOffsiteBookingUseCase = new CreateOffsiteBookingUseCase(bookingRepository,offsiteCapacityValidationService,transactionManager,bookingIdGenerator)
