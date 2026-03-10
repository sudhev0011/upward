import { Schema, model, Document, Types } from 'mongoose';

export interface ClientProfileDocument extends Document {
  userId: Types.ObjectId;
  location?: string;
  phone?: string;
  profilePicture?: string; 
  createdAt: Date;
  updatedAt: Date;
}

const ClientProfileSchema = new Schema<ClientProfileDocument>(
  {
    userId: { type: Schema.Types.ObjectId, required: true, ref: 'User', unique: true, index: true },
    location: { type: String },
    phone: { type: String },
    profilePicture: { type: String }, 
  },
  { timestamps: true },
);

export const ClientProfileModel = model<ClientProfileDocument>('ClientProfile', ClientProfileSchema);