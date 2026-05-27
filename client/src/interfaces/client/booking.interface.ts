import { PaymentType } from "@/enums/payment-type.enum";
import { Location } from "../location.interface";
// --- Slot ---

export interface AvailableSlot {
  startTime: string; // HH:mm
  endTime: string;   // HH:mm
}

export interface GetAvailableSlotsRequest {
  providerId: string;
  providerServiceId: string;
  date: string; // YYYY-MM-DD
}

// --- Booking ---

export interface CreateBookingRequest {
  providerServiceId: string;
  bookingDate: string; // YYYY-MM-DD
  startTime: string;   // HH:mm
  paymentType: PaymentType;
  location: Location;
  notes?: string | null;
}

// Frontend-only — not sent to backend, used for UI state and confirmation display
export interface BookingFormState {
  providerId: string;
  providerServiceId: string;
  providerName: string;        // display only
  serviceLabel: string;        // display only
  bookingDate: string;         // YYYY-MM-DD
  startTime: string;           // HH:mm
  endTime: string;             // HH:mm — from slot response, display only
  paymentType: PaymentType | null;
  notes: string;
  location: Location | null;            // future backend field
}

// --- Response ---

export interface Booking {
  bookingId: string;
  providerServiceId: string;
  bookingDate: string;
  startTime: string;
  paymentType: PaymentType;
  notes?: string | null;
}

export interface CreatePaymentIntentRequest {
  bookingId: string;
}

export interface PaymentIntentResponse {
  paymentIntentId: string;
  clientSecret: string;
  paymentId: string;
}