import { clientApi } from "@/api/client.api";
import { ListBookingsRequest, ListBookingsResponse } from "@/interfaces/bookings/bookings.interface";
import { useQuery } from "@tanstack/react-query";

export const useListBookings = (
  params: ListBookingsRequest,
) => {
  return useQuery<ListBookingsResponse>({
    queryKey: ["client-bookings", params],

    queryFn: async () => {
      const response =
        await clientApi.listBookings(params);

      return response.data!;
    },
  });
};