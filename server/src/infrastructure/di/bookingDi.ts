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
import { RescheduleBookingUseCase } from "../../application/use-cases/booking/reschedule-booking.use-case";
import { SlotValidationService } from "../../application/services/slot-validation.service";
import { BookingTravelValidationService } from "../../application/services/booking-travel-validation.service";
import { ServiceRepository } from "../persistence/mongodb/repositories/service.repository";
import { CategoryRepository } from "../persistence/mongodb/repositories/category.repository";
import { AvailabilityRepository } from "../persistence/mongodb/repositories/availability.repository";
import { AvailabilityOverrideRepository } from "../persistence/mongodb/repositories/availability-override.repository";
import { WorkingHoursResolverService } from "../../application/services/working-hours-resolver.service";
import { UnavailabilityResolverService } from "../../application/services/unavailability-resolver.service";
import { ProviderProfileRepository } from "../persistence/mongodb/repositories/provider-profile.repository";
import { GeoapifyMapsService } from "../external-services/maps/geopify-maps.service";

const bookingRepository = new BookingRepository();
const providerServiceRepository = new ProviderServiceRepository();
const unavailabilityRepository = new UnavailabilityRepository();
const walletRepository = new WalletRepository();
const walletTransactionRepository = new WalletTransactionRepository();
const transactionManager = new MongoTransactionManager();
const bookingIdGenerator = new NanoIdBookingIdtor();

// Repositories needed for slot & travel validation
const serviceRepository = new ServiceRepository();
const categoryRepository = new CategoryRepository();
const availabilityRepository = new AvailabilityRepository();
const availabilityOverrideRepository = new AvailabilityOverrideRepository();
const providerProfileRepository = new ProviderProfileRepository();

// Services needed for slot & travel validation
const workingHoursResolverService = new WorkingHoursResolverService(
  availabilityRepository,
  availabilityOverrideRepository,
);
const unavailabilityResolverService = new UnavailabilityResolverService(
  unavailabilityRepository,
);
const geoapifyMapsService = new GeoapifyMapsService();

const slotValidationService = new SlotValidationService(
  providerServiceRepository,
  serviceRepository,
  categoryRepository,
  bookingRepository,
  workingHoursResolverService,
  unavailabilityResolverService,
);

const bookingTravelValidationService = new BookingTravelValidationService(
  bookingRepository,
  providerProfileRepository,
  geoapifyMapsService,
);

export const offsiteCapacityValidationService =
  new OffsiteCapacityValidationService(
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

export const createOffsiteBookingUseCase = new CreateOffsiteBookingUseCase(
  bookingRepository,
  offsiteCapacityValidationService,
  transactionManager,
  bookingIdGenerator,
);

export const rescheduleBookingUseCase = new RescheduleBookingUseCase(
  bookingRepository,
  unavailabilityRepository,
  slotValidationService,
  bookingTravelValidationService,
  transactionManager,
);

