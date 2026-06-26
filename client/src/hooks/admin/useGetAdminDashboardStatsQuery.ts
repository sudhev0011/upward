import { useQuery } from "@tanstack/react-query";
import { adminApi } from "@/api/admin.api";

export const useGetAdminDashboardStatsQuery = (timeframe: string) => {
  return useQuery({
    queryKey: ["adminDashboardStats", timeframe],
    queryFn: () => adminApi.getDashboardStats(timeframe),
  });
};
