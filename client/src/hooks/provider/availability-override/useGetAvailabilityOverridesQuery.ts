import { useQuery } from "@tanstack/react-query";
import { providerApi } from "@/api/provider.api";

export const useGetAvailabilityOverridesQuery = () => {
  return useQuery({
    queryKey: ['availabilityOverrides'],
    queryFn: providerApi.getAvailabilityOverrides,
  });
};