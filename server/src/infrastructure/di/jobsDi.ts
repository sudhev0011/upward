import { BookingExpirationJob } from "../jobs/booking-expiration.job";
import { expirePendingBookingsUseCase } from "./bookingDi";
import { WinstonLogger } from "../services/logger.service";

const logger = new WinstonLogger();

export const bookingExpirationJob = new BookingExpirationJob(
  expirePendingBookingsUseCase,
  logger,
);
