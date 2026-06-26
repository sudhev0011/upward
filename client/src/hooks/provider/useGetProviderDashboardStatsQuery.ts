import { useQuery } from "@tanstack/react-query";
import { providerApi } from "@/api/provider.api";

export const useGetProviderDashboardStatsQuery = (timeframe: string) => {
  return useQuery({
    queryKey: ["providerDashboardStats", timeframe],
    queryFn: () => providerApi.getDashboardStats(timeframe),
  });
};
