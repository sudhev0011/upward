import { MongoReviewRepository } from '../persistence/mongodb/repositories/review.repository';
import { BookingRepository } from '../persistence/mongodb/repositories/booking.repository';
import { ProviderProfileRepository } from '../persistence/mongodb/repositories/provider-profile.repository';
import { UserRepository } from '../persistence/mongodb/repositories/user.repository';
import { MongoTransactionManager } from '../persistence/mongodb/mongo-transaction.manager';

import { CreateReviewUseCase } from '../../application/use-cases/review/create-review.use-case';
import { GetProviderReviewsUseCase } from '../../application/use-cases/review/get-provider-reviews.use-case';
import { GetClientReviewsUseCase } from '../../application/use-cases/review/get-client-reviews.use-case';
import { GetPendingReviewsUseCase } from '../../application/use-cases/review/get-pending-reviews.use-case';
import { CompleteBookingUseCase } from '../../application/use-cases/booking/complete-booking.use-case';
import { ReviewController } from '../../presentation/controllers/review.controller';

// Repositories
const reviewRepository = new MongoReviewRepository();
const bookingRepository = new BookingRepository();
const providerProfileRepository = new ProviderProfileRepository();
const userRepository = new UserRepository();
const transactionManager = new MongoTransactionManager();

// Use cases
export const createReviewUseCase = new CreateReviewUseCase(
  reviewRepository,
  bookingRepository,
  providerProfileRepository,
  transactionManager
);

export const getProviderReviewsUseCase = new GetProviderReviewsUseCase(
  reviewRepository,
  userRepository
);

export const getClientReviewsUseCase = new GetClientReviewsUseCase(
  reviewRepository,
  userRepository
);

export const getPendingReviewsUseCase = new GetPendingReviewsUseCase(
  reviewRepository,
  bookingRepository
);

export const completeBookingUseCase = new CompleteBookingUseCase(
  bookingRepository
);

// Controller
export const reviewController = new ReviewController(
  createReviewUseCase,
  getProviderReviewsUseCase,
  getClientReviewsUseCase,
  getPendingReviewsUseCase,
  completeBookingUseCase
);
