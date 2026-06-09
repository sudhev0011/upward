import { useMutation, useQueryClient } from "@tanstack/react-query";
import { clientApi } from "@/api/client.api";
import { providerApi } from "@/api/provider.api";
import { ApiErrorResponse } from "@/interfaces/auth";
import { AxiosError } from "axios";

export interface CancelBookingVariables {
  bookingId: string;
  role: "client" | "provider";
  reason?: string | null;
}

export const useCancelBooking = () => {
  const queryClient = useQueryClient();

  return useMutation<void, AxiosError<ApiErrorResponse>, CancelBookingVariables>({
    mutationFn: async ({ bookingId, role, reason }) => {
      if (role === "client") {
        await clientApi.cancelBooking(bookingId, reason);
      } else {
        await providerApi.cancelBooking(bookingId, reason);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["client-bookings"] });
      queryClient.invalidateQueries({ queryKey: ["provider-bookings"] });
      queryClient.invalidateQueries({ queryKey: ["client-wallet"] });
    },
  });
};
