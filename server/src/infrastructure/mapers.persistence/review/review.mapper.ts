import { Types } from 'mongoose';
import { Review } from '../../../domain/entities/review.entity';
import { ReviewDocument } from '../../persistence/mongodb/models/review.model';

export class ReviewMapper {
  static toEntity(doc: ReviewDocument): Review {
    return Review.create({
      id: String(doc._id),
      bookingId: String(doc.bookingId),
      clientId: String(doc.clientId),
      providerId: String(doc.providerId),
      serviceId: String(doc.serviceId),
      rating: doc.rating,
      comment: doc.comment,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    });
  }

  static toDocument(entity: Partial<Review>): Partial<ReviewDocument> {
    const doc: Partial<ReviewDocument> = {};
    
    if (entity.bookingId) {
      doc.bookingId = new Types.ObjectId(entity.bookingId);
    }
    if (entity.clientId) {
      doc.clientId = new Types.ObjectId(entity.clientId);
    }
    if (entity.providerId) {
      doc.providerId = new Types.ObjectId(entity.providerId);
    }
    if (entity.serviceId) {
      doc.serviceId = new Types.ObjectId(entity.serviceId);
    }
    if (entity.rating !== undefined) {
      doc.rating = entity.rating;
    }
    if (entity.comment !== undefined) {
      doc.comment = entity.comment;
    }
    
    return doc;
  }
}
