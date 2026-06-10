export const UnavailabilitySource = {
  MANUAL: "manual",
  BOOKING: "booking",
} as const;

export type UnavailabilitySource =
  (typeof UnavailabilitySource)[keyof typeof UnavailabilitySource];

export interface CreateUnavailabilityRequest {
  startDate: Date; 
  endDate: Date;   
  reason?: string | null;
  source: UnavailabilitySource;
  bookingId?: string | null;
}

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