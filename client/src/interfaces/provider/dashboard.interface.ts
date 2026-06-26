export interface ProviderDashboardStats {
  totalOrders: number;
  upcomingBookingsCount: number;
  walletBalance: number;
  totalEarnings: number;
  earningsOverview: Array<{ label: string; earnings: number }>;
  recentOrders: Array<{
    id: string;
    client: string;
    service: string;
    date: string;
    amount: number;
    status: string;
  }>;
  upcomingBookings: Array<{
    client: string;
    service: string;
    date: string;
    time: string;
  }>;
}
