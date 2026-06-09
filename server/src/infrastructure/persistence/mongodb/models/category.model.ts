import { Document, model, Schema } from "mongoose";
import { ServiceMode } from "../../../../domain/entity.types";

export interface CategoryDocument extends Document {
  name: string;
  description: string | null;
  mode: ServiceMode;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CategorySchema = new Schema<CategoryDocument>(
  {
    name: { type: String, required: true, unique: true },
    description: String,
    mode: {type: String, enum: ['onsite', 'offsite', 'both'], required: true},
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export const CategoryModel = model<CategoryDocument>("Category", CategorySchema)
