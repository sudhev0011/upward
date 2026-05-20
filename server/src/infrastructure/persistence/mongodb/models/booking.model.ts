import { Document, model, Schema, Types } from "mongoose";

import { BookingStatus } from "../../../../domain/enums/booking-status.enum";

import { PaymentStatus } from "../../../../domain/enums/payment-status.enum";

import { PaymentType } from "../../../../domain/enums/payment-type.enum";

export interface BookingDocument extends Document {
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

  startDateTime: Date;

  endDateTime: Date;

  notes: string | null;

  cancelledBy: Types.ObjectId | null;

  cancellationReason: string | null;

  cancelledAt: Date | null;

  expiresAt: Date | null;

  createdAt: Date;

  updatedAt: Date;
}

const BookingSchema = new Schema<BookingDocument>(
  {
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

    startDateTime: {
      type: Date,
      required: true,
      index: true,
    },

    endDateTime: {
      type: Date,
      required: true,
    },

    notes: {
      type: String,
      trim: true,
      default: null,
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

BookingSchema.pre("save", function () {
  if (this.startDateTime >= this.endDateTime) {
    throw new Error("endDateTime must be after startDateTime");
  }

  if (this.paidAmount > this.totalAmount) {
    throw new Error("paidAmount cannot exceed totalAmount");
  }
});

export const BookingModel = model<BookingDocument>("Booking", BookingSchema);