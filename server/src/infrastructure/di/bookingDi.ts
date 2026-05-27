import { ExpirePendingBookingsUseCase } from "../../application/use-cases/booking/expire-pending-booking.use-case";
import { ListBookingsUseCase } from "../../application/use-cases/booking/list-booking-use-case";
import { MongoTransactionManager } from "../persistence/mongodb/mongo-transaction.manager";
import { BookingRepository } from "../persistence/mongodb/repositories/booking.repository";
import { UnavailabilityRepository } from "../persistence/mongodb/repositories/unavailability.repository";

const bookingRepository = new BookingRepository()
const unavailabilityRepository = new UnavailabilityRepository()
const transactionManager = new MongoTransactionManager()


export const expirePendingBookingsUseCase = new ExpirePendingBookingsUseCase(bookingRepository,unavailabilityRepository,transactionManager)
export const listBookingUseCase = new ListBookingsUseCase(bookingRepository)