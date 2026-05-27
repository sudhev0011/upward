import { BookingStatus } from "../../../domain/enums/booking-status.enum";
import { PaymentStatus } from "../../../domain/enums/payment-status.enum";

export interface ListBookingsRequestDto {
  page?: number;
  limit?: number;

  search?: string;

  sortOrder?: "asc" | "desc";

  status?: BookingStatus[];

  paymentStatus?: PaymentStatus[];

  fromDate?: string;
  toDate?: string;
}