export interface ClientDashboardStats {
  activeBookings: number;
  tasksCompleted: number;
  totalSpent: number;
  savedPros: number;
  spendingOverview: Array<{ label: string; spent: number }>;
}
