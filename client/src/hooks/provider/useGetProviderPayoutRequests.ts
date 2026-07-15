import { useQuery } from "@tanstack/react-query";
import { providerApi } from "@/api/provider.api";

export const useGetProviderPayoutRequests = () => {
  return useQuery({
    queryKey: ["provider-payout-requests"],
    queryFn: async () => {
      const response = await providerApi.getPayoutRequests();
      return response.data;
    },
  });
};
