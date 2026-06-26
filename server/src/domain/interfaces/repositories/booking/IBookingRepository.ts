import { Booking } from "../../../entities/booking.entity";
import { BookingStatus } from "../../../enums/booking-status.enum";
import { PaymentStatus } from "../../../enums/payment-status.enum";
import { ListBookingsResponse } from "../../../queries/booking/list-bookings-response";
import { ITransactionContext } from "../../database/transaction-context.interface";
import { IBaseRepository } from "../base/IBaseRepository";

export interface IBookingRepository extends IBaseRepository<Booking> {
  findOverlappingActiveBooking(
    providerId: string,
    startDateTime: Date,
    endDateTime: Date,
  ): Promise<Booking | null>;

  findProviderBookings(providerId: string): Promise<Booking[]>;

  findCustomerBookings(customerId: string): Promise<Booking[]>;

  findByStatus(status: BookingStatus): Promise<Booking[]>;

  findExpiredPendingBookings(
    currentDate: Date,
    transaction?: ITransactionContext,
  ): Promise<Booking[]>;

  findPendingBookingByIdAndClientId(
    bookingId: string,
    clientId: string,
    transaction?: ITransactionContext,
  ): Promise<Booking | null>;

  listBookings(params: {
    page?: number;
    limit?: number;

    search?: string;

    sortOrder?: "asc" | "desc";

    status?: BookingStatus[];

    paymentStatus?: PaymentStatus[];

    fromDate?: string;
    toDate?: string;

    providerId?: string;
    clientId?: string;
  }): Promise<ListBookingsResponse>;

  findPreviousActiveBooking(
    providerId: string,

    bookingDate: string,

    startDateTime: Date,

    transaction?: ITransactionContext,
  ): Promise<Booking | null>;

  findNextActiveBooking(
    providerId: string,

    bookingDate: string,

    endDateTime: Date,

    transaction?: ITransactionContext,
  ): Promise<Booking | null>;

  countActiveOffsiteBookingsForDate(
    providerServiceId: string,

    bookingDate: string,

    transaction?: ITransactionContext,
  ): Promise<number>;

  findConfirmedPartialBookingByIdAndClientId(
    bookingId: string,
    clientId: string,
    transaction?: ITransactionContext,
  ): Promise<Booking | null>;

  findBookingsReadyForPayout(before: Date): Promise<Booking[]>;

  findPendingPayoutBookings(providerId: string): Promise<Booking[]>;

  getClientDashboardStats(
    clientId: string,
    startDate: Date,
    grouping: "hour" | "day" | "week" | "month",
  ): Promise<{
    activeBookings: number;
    tasksCompleted: number;
    totalSpent: number;
    savedPros: number;
    spendingOverview: Array<{ label: string; spent: number }>;
  }>;

  getProviderDashboardStats(
    providerId: string,
    startDate: Date,
    grouping: "hour" | "day" | "week" | "month",
  ): Promise<{
    totalOrders: number;
    upcomingBookingsCount: number;
    walletBalance: number;
    totalEarnings: number;
    earningsOverview: Array<{ label: string; earnings: number }>;
  }>;

  getAdminDashboardStats(
    startDate: Date,
    grouping: "hour" | "day" | "week" | "month",
  ): Promise<{
    pendingOrdersCount: number;
    totalRevenue: number;
    activeProviders: number;
    activeClients: number;
    revenueOverview: Array<{ label: string; revenue: number }>;
    serviceDistribution: Array<{ name: string; value: number; fill: string }>;
    recentTransactions: Array<{
      id: string;
      transactionId: string;
      clientName: string;
      amount: number;
      status: string;
    }>;
    topProviders: Array<{
      id: string;
      name: string;
      avatar: string;
      completedJobs: number;
      rating: number;
    }>;
  }>;
}
