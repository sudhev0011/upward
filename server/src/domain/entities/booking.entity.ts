import { BookingStatus } from "../enums/booking-status.enum";
import { PaymentStatus } from "../enums/payment-status.enum";
import { PaymentType } from "../enums/payment-type.enum";

import {
  UnprocessableEntityError,
  ValidationError,
} from "../errors/errors";

export class Booking {
  constructor(
    public readonly id: string | undefined,

    public readonly clientId: string,
    public readonly providerId: string,
    public readonly serviceId: string,
    public readonly providerServiceId: string,

    public readonly status: BookingStatus,

    public readonly paymentType: PaymentType,
    public readonly paymentStatus: PaymentStatus,

    public readonly totalAmount: number,
    public readonly paidAmount: number,
    public readonly remainingAmount: number,

    public readonly refundAmount: number,

    public readonly bookingDate: string,

    public readonly startDateTime: Date,
    public readonly endDateTime: Date,

    public readonly notes: string | null,

    public readonly cancelledBy: string | null,
    public readonly cancellationReason: string | null,
    public readonly cancelledAt: Date | null,

    public readonly expiresAt: Date | null,

    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {}

  static create(data: {
    id?: string;

    clientId: string;
    providerId: string;
    serviceId: string;
    providerServiceId: string;

    paymentType: PaymentType;

    totalAmount: number;
    paidAmount: number;

    bookingDate: string;

    startDateTime: Date;
    endDateTime: Date;

    notes?: string | null;

    expiresAt?: Date | null;

    status?: BookingStatus;
    paymentStatus?: PaymentStatus;

    refundAmount?: number;

    cancelledBy?: string | null;
    cancellationReason?: string | null;
    cancelledAt?: Date | null;

    createdAt?: Date;
    updatedAt?: Date;
  }): Booking {
    /**
     * VALIDATIONS
     */

    if (data.totalAmount <= 0) {
      throw new ValidationError(
        "Total amount must be greater than zero"
      );
    }

    if (data.paidAmount < 0) {
      throw new ValidationError(
        "Paid amount cannot be negative"
      );
    }

    if (data.paidAmount > data.totalAmount) {
      throw new ValidationError(
        "Paid amount cannot exceed total amount"
      );
    }

    if (data.startDateTime >= data.endDateTime) {
      throw new ValidationError(
        "End datetime must be after start datetime"
      );
    }

    const now = new Date();

    const remainingAmount =
      data.totalAmount - data.paidAmount;

    return new Booking(
      data.id,

      data.clientId,
      data.providerId,
      data.serviceId,
      data.providerServiceId,

      data.status ?? BookingStatus.PENDING,

      data.paymentType,

      data.paymentStatus ??
        PaymentStatus.UNPAID,

      data.totalAmount,
      data.paidAmount,
      remainingAmount,

      data.refundAmount ?? 0,

      data.bookingDate,

      data.startDateTime,
      data.endDateTime,

      data.notes ?? null,

      data.cancelledBy ?? null,
      data.cancellationReason ?? null,
      data.cancelledAt ?? null,

      data.expiresAt ?? null,

      data.createdAt ?? now,
      data.updatedAt ?? now
    );
  }

  /**
   * CONFIRM BOOKING
   */

  confirm(): Booking {
    if (this.status !== BookingStatus.PENDING) {
      throw new UnprocessableEntityError(
        "Only pending bookings can be confirmed"
      );
    }

    return new Booking(
      this.id,

      this.clientId,
      this.providerId,
      this.serviceId,
      this.providerServiceId,

      BookingStatus.CONFIRMED,

      this.paymentType,

      this.remainingAmount === 0
        ? PaymentStatus.PAID
        : PaymentStatus.PARTIALLY_PAID,

      this.totalAmount,
      this.paidAmount,
      this.remainingAmount,

      this.refundAmount,

      this.bookingDate,

      this.startDateTime,
      this.endDateTime,

      this.notes,

      this.cancelledBy,
      this.cancellationReason,
      this.cancelledAt,

      this.expiresAt,

      this.createdAt,
      new Date()
    );
  }

  /**
   * EXPIRE BOOKING
   */

  expire(): Booking {
    if (this.status !== BookingStatus.PENDING) {
      throw new UnprocessableEntityError(
        "Only pending bookings can expire"
      );
    }

    return new Booking(
      this.id,

      this.clientId,
      this.providerId,
      this.serviceId,
      this.providerServiceId,

      BookingStatus.EXPIRED,

      this.paymentType,

      PaymentStatus.UNPAID,

      this.totalAmount,
      this.paidAmount,
      this.remainingAmount,

      this.refundAmount,

      this.bookingDate,

      this.startDateTime,
      this.endDateTime,

      this.notes,

      this.cancelledBy,
      this.cancellationReason,
      this.cancelledAt,

      this.expiresAt,

      this.createdAt,
      new Date()
    );
  }

  /**
   * CANCEL BOOKING
   */

  cancel(data: {
    cancelledBy: string;
    reason?: string | null;
    refundAmount?: number;
  }): Booking {
    if (
      this.status === BookingStatus.CANCELLED ||
      this.status === BookingStatus.EXPIRED
    ) {
      throw new UnprocessableEntityError(
        "Booking already inactive"
      );
    }

    return new Booking(
      this.id,

      this.clientId,
      this.providerId,
      this.serviceId,
      this.providerServiceId,

      BookingStatus.CANCELLED,

      this.paymentType,

      data.refundAmount && data.refundAmount > 0
        ? PaymentStatus.REFUNDED
        : this.paymentStatus,

      this.totalAmount,
      this.paidAmount,
      this.remainingAmount,

      data.refundAmount ?? 0,

      this.bookingDate,

      this.startDateTime,
      this.endDateTime,

      this.notes,

      data.cancelledBy,
      data.reason ?? null,
      new Date(),

      this.expiresAt,

      this.createdAt,
      new Date()
    );
  }

  /**
   * CHECK IF ACTIVE OCCUPANCY
   */

  isOccupyingSlot(): boolean {
    return (
      this.status === BookingStatus.PENDING ||
      this.status === BookingStatus.CONFIRMED ||
      this.status === BookingStatus.COMPLETED
    );
  }

  /**
   * CHECK IF EXPIRED
   */

  isExpired(): boolean {
    if (!this.expiresAt) {
      return false;
    }

    return new Date() > this.expiresAt;
  }
}