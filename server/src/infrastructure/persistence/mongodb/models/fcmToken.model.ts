import { Document, Schema, model, Types } from 'mongoose';

export interface FcmTokenDocument extends Document {
  userId: Types.ObjectId;
  token: string;
  deviceType?: string;
  createdAt: Date;
}

const FcmTokenSchema = new Schema<FcmTokenDocument>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    token: { type: String, required: true, unique: true },
    deviceType: { type: String, default: 'web' }
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const FcmTokenModel = model<FcmTokenDocument>('FcmToken', FcmTokenSchema);