import { BookingExpirationJob } from "../jobs/booking-expiration.job";
import { expirePendingBookingsUseCase } from "./bookingDi";
import { WinstonLogger } from "../services/logger.service";
import { ProviderPayoutJob } from "../jobs/provider-payout.jobs";
import { processProviderPayoutsUseCase } from "./paymentDi";

const logger = new WinstonLogger();

export const bookingExpirationJob = new BookingExpirationJob(
  expirePendingBookingsUseCase,
  logger,
);

export const providerPayoutJob = new ProviderPayoutJob(processProviderPayoutsUseCase,logger)
