import { Document, model, Schema, Types } from "mongoose";

import { BookingStatus } from "../../../../domain/enums/booking-status.enum";

import { PaymentStatus } from "../../../../domain/enums/payment-status.enum";

import { PaymentType } from "../../../../domain/enums/payment-type.enum";
import { BookingMode } from "../../../../domain/enums/bookingMode.enum";

interface GeoPoint {
  type: "Point";
  coordinates: [number, number]; // [lng, lat]
}

interface ClientLocation {
  placeId: string;
  address: string;
  city?: string | null;
  state?: string | null;
  country?: string | null;
  coordinates: GeoPoint;
}
export interface BookingDocument extends Document {
  bookingId: string;

  clientId: Types.ObjectId;

  providerId: Types.ObjectId;

  providerServiceId: Types.ObjectId;

  serviceId: Types.ObjectId;

  status: BookingStatus;

  paymentType: PaymentType;

  paymentStatus: PaymentStatus;

  totalAmount: number;

  paidAmount: number;

  remainingAmount: number;

  refundAmount: number;

  bookingDate: string;

  bookingMode: BookingMode;

  startDateTime: Date | null;

  endDateTime: Date | null;

  location: ClientLocation | null;

  notes: string | null;

  requirements: string[];

  cancelledBy: Types.ObjectId | null;

  cancellationReason: string | null;

  cancelledAt: Date | null;

  expiresAt: Date | null;

  createdAt: Date;

  updatedAt: Date;
}

const ClientLocationSchema = new Schema<ClientLocation>(
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

const BookingSchema = new Schema<BookingDocument>(
  {
    bookingId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    clientId: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    providerId: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    providerServiceId: {
      type: Types.ObjectId,
      ref: "ProviderService",
      required: true,
      index: true,
    },

    serviceId: {
      type: Types.ObjectId,
      ref: "Service",
      required: true,
      index: true,
    },

    status: {
      type: String,
      enum: Object.values(BookingStatus),
      required: true,
      default: BookingStatus.PENDING,
      index: true,
    },

    paymentType: {
      type: String,
      enum: Object.values(PaymentType),
      required: true,
    },

    paymentStatus: {
      type: String,
      enum: Object.values(PaymentStatus),
      required: true,
      default: PaymentStatus.UNPAID,
    },

    totalAmount: {
      type: Number,
      required: true,
    },

    paidAmount: {
      type: Number,
      required: true,
      default: 0,
    },

    remainingAmount: {
      type: Number,
      required: true,
    },

    refundAmount: {
      type: Number,
      default: 0,
    },

    bookingDate: {
      type: String,
      required: true,
      index: true,
    },

    bookingMode: {
      type: String,
      enum: Object.values(BookingMode),
      required: true,
    },

    startDateTime: {
      type: Date,
      index: true,
    },

    endDateTime: {
      type: Date,
    },

    location: {
      type: ClientLocationSchema,
    },

    notes: {
      type: String,
      trim: true,
      default: null,
    },

    requirements: {
      type: [String],
      default: [],
    },

    cancelledBy: {
      type: Types.ObjectId,
      ref: "User",
      default: null,
    },

    cancellationReason: {
      type: String,
      trim: true,
      default: null,
    },

    cancelledAt: {
      type: Date,
      default: null,
    },

    expiresAt: {
      type: Date,
      default: null,
      index: true,
    },
  },
  {
    timestamps: true,
  },
);

BookingSchema.index({
  providerId: 1,
  startDateTime: 1,
  endDateTime: 1,
});

export const BookingModel = model<BookingDocument>("Booking", BookingSchema);
