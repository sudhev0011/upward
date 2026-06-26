import { useQuery } from "@tanstack/react-query";
import { clientApi } from "@/api/client.api";

export const useGetClientDashboardStatsQuery = (timeframe: string) => {
  return useQuery({
    queryKey: ["clientDashboardStats", timeframe],
    queryFn: () => clientApi.getDashboardStats(timeframe),
  });
};
