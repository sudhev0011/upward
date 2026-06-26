import { BookingStatus } from "../../../../domain/enums/booking-status.enum";
import { IBookingRepository } from "../../../../domain/interfaces/repositories/booking/IBookingRepository";
import {
  IGetProviderDashboardStatsUseCase,
  ProviderDashboardStatsResponse,
} from "../../../../domain/interfaces/usecases/provider/dashboard/IGetProviderDashboardStatsUseCase";
import { getStartDateForTimeframe, getGroupingForTimeframe } from "../../../../shared/utils/dashboard.utils";

export class GetProviderDashboardStatsUseCase implements IGetProviderDashboardStatsUseCase {
  constructor(private readonly bookingRepository: IBookingRepository) {}

  async execute(providerId: string, timeframe: string): Promise<ProviderDashboardStatsResponse> {
    const startDate = getStartDateForTimeframe(timeframe);
    const grouping = getGroupingForTimeframe(timeframe);

    const stats = await this.bookingRepository.getProviderDashboardStats(
      providerId,
      startDate,
      grouping,
    );

    const recentBookings = await this.bookingRepository.listBookings({
      providerId,
      limit: 5,
    });

    const recentOrders = recentBookings.data.map((booking) => ({
      id: booking.bookingId,
      client: booking.client?.name || "Client",
      service: booking.service?.name || "Service",
      date: booking.bookingDate,
      amount: booking.totalAmount,
      status: booking.status,
    }));

    const upcomingBookingsResult = await this.bookingRepository.listBookings({
      providerId,
      status: [BookingStatus.CONFIRMED],
      limit: 5,
    });

    const upcomingBookings = upcomingBookingsResult.data.map((booking) => {
      const start = booking.startDateTime ? new Date(booking.startDateTime) : new Date();
      return {
        client: booking.client?.name || "Client",
        service: booking.service?.name || "Service",
        date: booking.bookingDate,
        time: start.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
    });

    return {
      totalOrders: stats.totalOrders,
      upcomingBookingsCount: stats.upcomingBookingsCount,
      walletBalance: stats.walletBalance,
      totalEarnings: stats.totalEarnings,
      earningsOverview: stats.earningsOverview,
      recentOrders,
      upcomingBookings,
    };
  }
}
