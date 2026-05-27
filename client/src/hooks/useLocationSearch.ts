import { useQuery } from "@tanstack/react-query";
import { locationApi } from "@/api/location";

export const useLocationSearch = (
  query: string,
) => {
  return useQuery({
    queryKey: ["location-search", query],

    queryFn: () => locationApi.searchLocations(query),

    enabled: query.trim().length >= 3,

    staleTime: 1000 * 60 * 5,
  });
};