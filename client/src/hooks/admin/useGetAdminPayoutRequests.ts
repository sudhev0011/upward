import { useQuery } from "@tanstack/react-query";
import { adminApi } from "@/api/admin.api";

export const useGetAdminPayoutRequests = () => {
  return useQuery({
    queryKey: ["admin-payout-requests"],
    queryFn: async () => {
      const response = await adminApi.getPayoutRequests();
      return response.data;
    },
  });
};
