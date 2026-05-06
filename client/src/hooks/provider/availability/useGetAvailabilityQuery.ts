import { useQuery } from "@tanstack/react-query";
import { providerApi } from "@/api/provider.api";

export const useGetAvailabilityQuery = () => {
  return useQuery({
    queryKey: ['availability'],
    queryFn: providerApi.getAvailability,
  });
};