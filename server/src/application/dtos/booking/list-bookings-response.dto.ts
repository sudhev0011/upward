import { BookingStatus } from "../../../domain/enums/booking-status.enum";
import { BookingMode } from "../../../domain/enums/bookingMode.enum";
import { PaymentStatus } from "../../../domain/enums/payment-status.enum";
import { PaymentType } from "../../../domain/enums/payment-type.enum";

export interface BookingListItemResponseDto {
  id: string;
  
  bookingId: string;
  status: BookingStatus;
  paymentStatus: PaymentStatus;
  paymentType: PaymentType;

  totalAmount: number;
  paidAmount: number;
  remainingAmount: number;
  refundAmount: number;

  bookingDate: string;

  bookingMode: BookingMode;

  startDateTime: Date | null;
  endDateTime: Date | null;

  notes: string | null;

  requirements: string[];

  location: {
    placeId: string;
    address: string;
    city?: string | null;
    state?: string | null;
    country?: string | null;

    coordinates: {
      type: "Point";
      coordinates: [number, number];
    };
  } | null;

  client: {
    id: string;
    name?: string;
    email: string;
    avatarFileName?: string | null;
  };

  provider: {
    id: string;
    name?: string;
    email: string;
    avatarFileName?: string | null;
  };

  service: {
    id: string;
    name: string;
    description?: string | null;
    mode: string;
  };

  providerService: {
    id: string;
    price?: number | null;
    status: string;
  };

  createdAt: Date;
  updatedAt: Date;
}

export interface ListBookingsResponseDto {
  data: BookingListItemResponseDto[];

  total: number;
  page: number;
  limit: number;
  totalPages: number;
}