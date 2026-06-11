import { IReviewRepository } from '../../../domain/interfaces/repositories/review/IReviewRepository';
import { IBookingRepository } from '../../../domain/interfaces/repositories/booking/IBookingRepository';
import { IProviderProfileRepository } from '../../../domain/interfaces/repositories/provider/IProviderProfileRepository';
import { ITransactionManager } from '../../../domain/interfaces/database/transaction-manager.interface';
import { Review } from '../../../domain/entities/review.entity';
import { BookingStatus } from '../../../domain/enums/booking-status.enum';
import { NotFoundError, ValidationError, UnprocessableEntityError } from '../../../domain/errors/errors';

export class CreateReviewUseCase {
  constructor(
    private readonly _reviewRepository: IReviewRepository,
    private readonly _bookingRepository: IBookingRepository,
    private readonly _providerProfileRepository: IProviderProfileRepository,
    private readonly _transactionManager: ITransactionManager
  ) {}

  async execute(params: {
    bookingId: string;
    clientId: string;
    rating: number;
    comment: string | null;
  }): Promise<Review> {
    const { bookingId, clientId, rating, comment } = params;

    if (rating < 1 || rating > 5) {
      throw new ValidationError('Rating must be between 1 and 5');
    }

    const booking = await this._bookingRepository.findById(bookingId);
    if (!booking) {
      throw new NotFoundError('Booking not found');
    }

    if (booking.clientId !== clientId) {
      throw new ValidationError('You can only review bookings you have created');
    }

    if (booking.status !== BookingStatus.COMPLETED) {
      throw new UnprocessableEntityError('Only completed bookings can be reviewed');
    }

    const existingReview = await this._reviewRepository.findByBookingId(bookingId);
    if (existingReview) {
      throw new UnprocessableEntityError('You have already reviewed this booking');
    }

    return this._transactionManager.runInTransaction(async (transaction) => {
      const reviewEntity = Review.create({
        bookingId,
        clientId,
        providerId: booking.providerId,
        serviceId: booking.serviceId,
        rating,
        comment,
      });

      const savedReview = await this._reviewRepository.create(reviewEntity, transaction);

      const profile = await this._providerProfileRepository.findOne({ userId: booking.providerId }, transaction);
      if (profile && profile.id) {
        const oldCount = profile.ratingCount || 0;
        const oldAvg = profile.ratingAvg || 0;
        const newCount = oldCount + 1;
        const newAvg = ((oldAvg * oldCount) + rating) / newCount;

        await this._providerProfileRepository.update(
          profile.id,
          { ratingCount: newCount, ratingAvg: Number(newAvg.toFixed(2)) },
          transaction
        );
      }

      return savedReview;
    });
  }
}
