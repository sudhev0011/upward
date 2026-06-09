import { PaymentType } from "@/enums/payment-type.enum";
import { Location } from "../location.interface";
import { BookingMode } from "@/enums/booking-mode";
export interface AvailableSlot {
  startTime: string; // HH:mm
  endTime: string; // HH:mm
}

export interface GetAvailableSlotsRequest {
  providerId: string;
  providerServiceId: string;
  date: string; // YYYY-MM-DD
}

export interface CreateOnsiteBookingRequest {
  providerServiceId: string;
  bookingDate: string;
  startTime: string;
  paymentType: PaymentType;
  location: Location;
  notes?: string | null;
  requirements: string[];
}

export interface CreateOffsiteBookingRequest {
  providerServiceId: string;
  bookingDate: string;
  paymentType: PaymentType;
  notes?: string | null;
  requirements: string[];
}

export interface BookingFormState {
  providerId: string;
  providerServiceId: string;
  providerName: string;
  serviceLabel: string;
  mode: BookingMode;
  bookingDate: string;
  startTime: string;
  endTime: string;
  paymentType: PaymentType | null;
  notes: string;
  location: Location | null;
  requirements: string[];
}

export interface Booking {
  id: string;
  bookingId: string;
  providerServiceId: string;
  bookingDate: string;
  startTime: string;
  paymentType: PaymentType;
  notes?: string | null;
  requirements: string[];
}

export interface CreatePaymentIntentRequest {
  bookingId: string;
}

export interface PaymentIntentResponse {
  paymentIntentId: string;
  clientSecret: string;
  paymentId: string;
}
