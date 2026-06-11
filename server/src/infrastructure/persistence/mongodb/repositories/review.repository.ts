import { Types } from 'mongoose';
import { IReviewRepository } from '../../../../domain/interfaces/repositories/review/IReviewRepository';
import { Review } from '../../../../domain/entities/review.entity';
import { ReviewModel, ReviewDocument } from '../models/review.model';
import { ReviewMapper } from '../../../mapers.persistence/review/review.mapper';
import { RepositoryBase } from './base.repository';

export class MongoReviewRepository
  extends RepositoryBase<Review, ReviewDocument>
  implements IReviewRepository
{
  constructor() {
    super(ReviewModel);
  }

  protected mapToEntity(document: ReviewDocument): Review {
    return ReviewMapper.toEntity(document);
  }

  protected mapToDocument(entity: Partial<Review>): Partial<ReviewDocument> {
    return ReviewMapper.toDocument(entity);
  }

  async findByBookingId(bookingId: string): Promise<Review | null> {
    if (!Types.ObjectId.isValid(bookingId)) return null;
    const doc = await this.model.findOne({ bookingId: new Types.ObjectId(bookingId) });
    return doc ? this.mapToEntity(doc) : null;
  }

  async findByProviderId(providerId: string, limit: number, skip: number): Promise<Review[]> {
    if (!Types.ObjectId.isValid(providerId)) return [];
    const docs = await this.model
      .find({ providerId: new Types.ObjectId(providerId) })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    return docs.map((doc) => this.mapToEntity(doc));
  }

  async findByClientId(clientId: string, limit: number, skip: number): Promise<Review[]> {
    if (!Types.ObjectId.isValid(clientId)) return [];
    const docs = await this.model
      .find({ clientId: new Types.ObjectId(clientId) })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    return docs.map((doc) => this.mapToEntity(doc));
  }
}
