export interface AdminDashboardStatsResponse {
  totalRevenue: number;
  activeProviders: number;
  activeClients: number;
  pendingOrders: number;
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
}

export interface IGetAdminDashboardStatsUseCase {
  execute(timeframe: string): Promise<AdminDashboardStatsResponse>;
}
