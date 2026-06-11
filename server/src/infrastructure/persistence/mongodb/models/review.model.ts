import { Document, Schema, model, Types } from 'mongoose';

export interface ReviewDocument extends Document {
  bookingId: Types.ObjectId;
  clientId: Types.ObjectId;
  providerId: Types.ObjectId;
  serviceId: Types.ObjectId;
  rating: number;
  comment: string | null;
  createdAt: Date;
  updatedAt: Date;
}

const ReviewSchema = new Schema<ReviewDocument>(
  {
    bookingId: { type: Schema.Types.ObjectId, ref: 'Booking', required: true, unique: true, index: true },
    clientId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    providerId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    serviceId: { type: Schema.Types.ObjectId, ref: 'Service', required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, default: null },
  },
  {
    timestamps: true,
  }
);

export const ReviewModel = model<ReviewDocument>('Review', ReviewSchema);
