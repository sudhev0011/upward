import { useMutation, useQueryClient } from "@tanstack/react-query";
import { clientApi } from "@/api/client.api";
import { providerApi } from "@/api/provider.api";
import { AxiosError } from "axios";
import { ApiErrorResponse } from "@/interfaces/auth";

export interface CompleteBookingVariables {
  bookingId: string;
  role: "client" | "provider";
}

export const useCompleteBooking = () => {
  const queryClient = useQueryClient();

  return useMutation<
    void,
    AxiosError<ApiErrorResponse>,
    CompleteBookingVariables
  >({
    mutationFn: async ({
      bookingId,
      role,
    }) => {
      if (role === "client") {
        await clientApi.completeBooking(
          bookingId,
        );
      } else {
        await providerApi.completeBooking(
          bookingId,
        );
      }
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["client-bookings"],
      });

      queryClient.invalidateQueries({
        queryKey: ["provider-bookings"],
      });

      queryClient.invalidateQueries({
        queryKey: ["client-wallet"],
      });

      queryClient.invalidateQueries({
        queryKey: ["provider-wallet"],
      });
    },
  });
};