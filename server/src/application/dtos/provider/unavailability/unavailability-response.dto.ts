import { UnavailabilitySource } from "../../../../domain/enums/unavailability.enum";

export interface UnavailabilityResponseDto {
  id: string;
  providerId: string;
  startDate: Date;
  endDate: Date;
  reason: string | null;
  source: UnavailabilitySource;
  bookingId: string | null;
  createdAt: Date;
  updatedAt: Date;
}