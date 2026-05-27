import { Schema, model, Document, Types } from "mongoose";

interface SocialLink {
  name: string;
  link: string;
}

interface GeoPoint {
  type: "Point";
  coordinates: [number, number]; // [lng, lat]
}

interface ProviderLocation {
  placeId: string;
  address: string;
  city?: string | null;
  state?: string |  null;
  country?: string | null;
  coordinates: GeoPoint;
}

export interface ProviderProfileDocument extends Document {
  userId: Types.ObjectId;

  bio?: string;

  location?: ProviderLocation;

  phone?: string;
  avatarUrl?: string;
  dateOfBirth?: Date;
  gender?: string;

  skills: string[];
  languages: string[];

  experience: string;

  ratingCount: number;
  ratingAvg: number;

  isApprovedByAdmin: boolean;

  socialLinks: SocialLink[];

  categories: string[];

  activeSubscriptionExpiresAt?: Date | null;
  activeSubscriptionPlanName?: string | null;

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

const ProviderLocationSchema = new Schema<ProviderLocation>(
  {
    placeId: {
      type: String,
      required: true,
    },

    address: {
      type: String,
      required: true,
    },

    city: {
      type: String,
    },

    state: {
      type: String,
    },

    country: {
      type: String,
    },

    coordinates: {
      type: {
        type: String,
        enum: ["Point"],
        required: true,
        default: "Point",
      },

      coordinates: {
        type: [Number], // [lng, lat]
        required: true,
      },
    },
  },
  { _id: false },
);

const ProviderProfileSchema = new Schema<ProviderProfileDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
      unique: true,
      index: true,
    },

    bio: {
      type: String,
    },

    location: {
      type: ProviderLocationSchema,
    },

    phone: {
      type: String,
    },

    avatarUrl: {
      type: String,
    },

    dateOfBirth: {
      type: Date,
    },

    gender: {
      type: String,
    },

    skills: [
      {
        type: String,
        default: [],
      },
    ],

    languages: [
      {
        type: String,
        default: [],
      },
    ],

    experience: {
      type: String,
    },

    ratingCount: {
      type: Number,
      default: 0,
    },

    ratingAvg: {
      type: Number,
      default: 0,
    },

    isApprovedByAdmin: {
      type: Boolean,
      default: false,
      index: true,
    },

    socialLinks: {
      type: [SocialLinkSchema],
      default: [],
    },

    categories: {
      type: [String],
      default: [],
      index: true,
    },

    activeSubscriptionExpiresAt: {
      type: Date,
      default: null,
      index: true,
    },

    activeSubscriptionPlanName: {
      type: String,
      default: null,
    },
  },
  { timestamps: true },
);

// GEO INDEX
ProviderProfileSchema.index({
  "location.coordinates": "2dsphere",
});

export const ProviderProfileModel = model<ProviderProfileDocument>(
  "ProviderProfile",
  ProviderProfileSchema,
);