import { useQuery } from "@tanstack/react-query";
import { adminApi } from "@/api/admin.api";

export const useGetAdminPayoutRequests = (params?: {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
}) => {
  return useQuery({
    queryKey: ["admin-payout-requests", params],
    queryFn: async () => {
      const response = await adminApi.getPayoutRequests(params);
      return response.data;
    },
  });
};

