import { Location } from "../../../common/location/location.dto";

export interface CreateBookingResponseDto {
  bookingId: string;

  status: string;

  paymentType: string;

  paymentStatus: string;

  totalAmount: number;

  paidAmount: number;

  remainingAmount: number;

  location: Location;

  expiresAt: Date | null;
}
