export interface IGetClientDashboardStatsUseCase {
  execute(clientId: string, timeframe: string): Promise<{
    activeBookings: number;
    tasksCompleted: number;
    totalSpent: number;
    savedPros: number;
    spendingOverview: Array<{ label: string; spent: number }>;
  }>;
}
