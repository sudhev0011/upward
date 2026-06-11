import { Review } from '../../../entities/review.entity';
import { IBaseRepository } from '../base/IBaseRepository';

export interface IReviewRepository extends IBaseRepository<Review> {
  findByBookingId(bookingId: string): Promise<Review | null>;
  findByProviderId(providerId: string, limit: number, skip: number): Promise<Review[]>;
  findByClientId(clientId: string, limit: number, skip: number): Promise<Review[]>;
}
