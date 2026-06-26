import { IBookingRepository } from "../../../../domain/interfaces/repositories/booking/IBookingRepository";
import {
  IGetAdminDashboardStatsUseCase,
  AdminDashboardStatsResponse,
} from "../../../../domain/interfaces/usecases/admin/dashboard/IGetAdminDashboardStatsUseCase";
import { getStartDateForTimeframe, getGroupingForTimeframe } from "../../../../shared/utils/dashboard.utils";

export class GetAdminDashboardStatsUseCase implements IGetAdminDashboardStatsUseCase {
  constructor(private readonly bookingRepository: IBookingRepository) {}

  async execute(timeframe: string): Promise<AdminDashboardStatsResponse> {
    const startDate = getStartDateForTimeframe(timeframe);
    const grouping = getGroupingForTimeframe(timeframe);
    const stats = await this.bookingRepository.getAdminDashboardStats(startDate, grouping);
    return {
      totalRevenue: stats.totalRevenue,
      activeProviders: stats.activeProviders,
      activeClients: stats.activeClients,
      pendingOrders: stats.pendingOrdersCount,
      revenueOverview: stats.revenueOverview,
      serviceDistribution: stats.serviceDistribution,
      recentTransactions: stats.recentTransactions,
      topProviders: stats.topProviders,
    };
  }
}
