import { IBookingRepository } from "../../../../domain/interfaces/repositories/booking/IBookingRepository";
import { IGetClientDashboardStatsUseCase } from "../../../../domain/interfaces/usecases/client/dashboard/IGetClientDashboardStatsUseCase";
import { getStartDateForTimeframe, getGroupingForTimeframe } from "../../../../shared/utils/dashboard.utils";

export class GetClientDashboardStatsUseCase implements IGetClientDashboardStatsUseCase {
  constructor(private readonly bookingRepository: IBookingRepository) {}

  async execute(clientId: string, timeframe: string): Promise<{
    activeBookings: number;
    tasksCompleted: number;
    totalSpent: number;
    savedPros: number;
    spendingOverview: Array<{ label: string; spent: number }>;
  }> {
    const startDate = getStartDateForTimeframe(timeframe);
    const grouping = getGroupingForTimeframe(timeframe);
    return this.bookingRepository.getClientDashboardStats(clientId, startDate, grouping);
  }
}
