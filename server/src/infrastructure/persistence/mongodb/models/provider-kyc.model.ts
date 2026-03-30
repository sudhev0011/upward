import { Schema, model, Document, Types } from 'mongoose';

export interface ProviderKycDocument extends Document {
  providerId: Types.ObjectId;
  fullName: string;
  aadhaarNumber: string;
  dateOfBirth: Date;
  address: string;
  aadhaarFrontUrl: string;
  aadhaarBackUrl: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Date;
  updatedAt: Date;
}

const ProviderKycSchema = new Schema<ProviderKycDocument>(
  {
    providerId: { type: Schema.Types.ObjectId, required: true, ref: 'User', unique: true, index: true },
    fullName: { type: String, required: true },
    aadhaarNumber: { type: String, required: true },
    dateOfBirth: { type: Date, required: true },
    address: { type: String, required: true },
    aadhaarFrontUrl: { type: String, required: true },
    aadhaarBackUrl: { type: String, required: true },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  },
  { timestamps: true },
);

export const ProviderKycModel = model<ProviderKycDocument>('ProviderKyc', ProviderKycSchema);
