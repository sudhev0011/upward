import { providerApi } from "@/api/provider.api";
import { ListBookingsRequest, ListBookingsResponse } from "@/interfaces/bookings/bookings.interface";
import { useQuery } from "@tanstack/react-query";

export const useProviderBookings = (params: ListBookingsRequest) => {
  return useQuery<ListBookingsResponse>({
    queryKey: ["provider-bookings", params],
    queryFn: async () => {
      const response = await providerApi.listBookings(params);
      return response.data!;
    },
  });
};
