import { Schema, model, Document, Types } from 'mongoose';

interface SocialLink {
  name: string;
  link: string;
}

export interface ProviderProfileDocument extends Document {
  userId: Types.ObjectId;
  bio?: string;
  location?: string;
  phone?: string;
  avatarUrl?: string; 
  dateOfBirth?: Date;
  gender?: string;
  skills: string[];
  languages: string[];
  experience: string,
  ratingCount: number,
  ratingAvg: number,
  isApprovedByAdmin: boolean,
  socialLinks: SocialLink[];
  createdAt: Date;
  updatedAt: Date;
}

const SocialLinkSchema = new Schema<SocialLink>(
  {
    name: { type: String, required: true },
    link: { type: String, required: true },
  },
  { _id: false },
);


const ProviderProfileSchema = new Schema<ProviderProfileDocument>(
  {
    userId: { type: Schema.Types.ObjectId, required: true, ref: 'User', unique: true, index: true },
    bio: { type: String },
    location: { type: String },
    phone: { type: String },
    avatarUrl: { type: String }, 
    dateOfBirth: { type: Date },
    gender: { type: String },
    skills: [{ type: String, default: [] }],
    languages: [{ type: String, default: [] }],
    experience: {type: String},
    ratingCount: {type:Number},
    ratingAvg: {type: Number},
    isApprovedByAdmin: {type: Boolean},
    socialLinks: { type: [SocialLinkSchema], default: [] },
  },
  { timestamps: true },
);

export const ProviderProfileModel = model<ProviderProfileDocument>('ProviderProfile', ProviderProfileSchema);