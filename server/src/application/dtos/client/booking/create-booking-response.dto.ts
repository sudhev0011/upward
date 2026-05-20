export interface CreateBookingResponseDto {
  bookingId: string;

  status: string;

  paymentType: string;

  paymentStatus: string;

  totalAmount: number;

  paidAmount: number;

  remainingAmount: number;

  expiresAt: Date | null;
}