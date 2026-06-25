import { useQuery } from "@tanstack/react-query";
import { providerApi } from "@/api/provider.api";

export const useGetPayoutsQuery = () => {
  return useQuery({
    queryKey: ["payouts"],
    queryFn: () => providerApi.getPayouts(),
  });
};
