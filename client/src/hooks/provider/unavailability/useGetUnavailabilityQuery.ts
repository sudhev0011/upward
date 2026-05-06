import { useQuery } from "@tanstack/react-query";
import { providerApi } from "@/api/provider.api";

export const useGetUnavailabilityQuery = () => {
  return useQuery({
    queryKey: ['unavailability'],
    queryFn: providerApi.getUnavailability,
  });
};