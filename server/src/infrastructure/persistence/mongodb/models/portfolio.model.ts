import { Schema, model, Document, Types } from "mongoose";

export interface PortfolioItemDocument extends Document {
  providerId: Types.ObjectId;
  title: string;
  description: string | null;
  images: string[];
  storageKeys: string[];
  thumbnailUrl: string | null;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

const PortfolioItemSchema = new Schema<PortfolioItemDocument>(
  {
    providerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    title:      { type: String, required: true },
    description:{ type: String, default: null },
    images:     { type: [String], default: [] },
    storageKeys:{ type: [String], default: [] },
    thumbnailUrl:{ type: String, default: null },
    tags:       { type: [String], default: [] },
  },
  { timestamps: true }
);

PortfolioItemSchema.index({ providerId: 1, createdAt: -1 });

export const PortfolioItemModel = model<PortfolioItemDocument>(
  "PortfolioItem",
  PortfolioItemSchema
);