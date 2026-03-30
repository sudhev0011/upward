import { Schema, model, Document, Types } from 'mongoose';

export interface ProviderBankDocument extends Document {
  providerId: Types.ObjectId;
  accountHolderName: string;
  bankName: string;
  accountNumber: string;
  ifscCode: string;
  branchName: string;
  passbookUrl: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Date;
  updatedAt: Date;
}

const ProviderBankSchema = new Schema<ProviderBankDocument>(
  {
    providerId: { type: Schema.Types.ObjectId, required: true, ref: 'User', unique: true, index: true },
    accountHolderName: { type: String, required: true },
    bankName: { type: String, required: true },
    accountNumber: { type: String, required: true },
    ifscCode: { type: String, required: true },
    branchName: { type: String, required: true },
    passbookUrl: { type: String, required: true },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  },
  { timestamps: true },
);

export const ProviderBankModel = model<ProviderBankDocument>('ProviderBank', ProviderBankSchema);
