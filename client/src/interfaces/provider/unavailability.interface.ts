// @/interfaces/provider/unavailability.interface.ts

export const UnavailabilitySource = {
  MANUAL: "manual",
  BOOKING: "booking",
} as const;

export type UnavailabilitySource =
  (typeof UnavailabilitySource)[keyof typeof UnavailabilitySource];

// 🔹 Create Request
export interface CreateUnavailabilityRequest {
  startDate: Date; // ISO
  endDate: Date;   // ISO
  reason?: string | null;
  source: UnavailabilitySource;
  bookingId?: string | null;
}

// 🔹 Response
export interface Unavailability {
  id: string;
  providerId: string;
  startDate: string;
  endDate: string;
  reason: string | null;
  source: UnavailabilitySource;
  bookingId: string | null;
  createdAt: string;
  updatedAt: string;
}