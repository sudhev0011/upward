import { useMutation, useQueryClient } from "@tanstack/react-query";
import { clientApi } from "@/api/client.api";
import { AxiosError } from "axios";
import { ApiErrorResponse } from "@/interfaces/auth";
import type { Location } from "@/interfaces/location.interface";

export interface RescheduleOnsiteBookingVariables {
  mode: "onsite";
  bookingId: string;
  bookingDate: string;
  startTime: string;
  location: Location;
}

export interface RescheduleOffsiteBookingVariables {
  mode: "offsite";
  bookingId: string;
  bookingDate: string;
}

export type RescheduleBookingVariables =
  | RescheduleOnsiteBookingVariables
  | RescheduleOffsiteBookingVariables;

export const useRescheduleBooking = () => {
  const queryClient = useQueryClient();

  return useMutation<
    void,
    AxiosError<ApiErrorResponse>,
    RescheduleBookingVariables
  >({
    mutationFn: async (variables) => {
      if (variables.mode === "onsite") {
        await clientApi.rescheduleOnsiteBooking(variables.bookingId, {
          bookingDate: variables.bookingDate,
          startTime: variables.startTime,
          location: variables.location,
        });
      } else {
        await clientApi.rescheduleOffsiteBooking(variables.bookingId, {
          bookingDate: variables.bookingDate,
        });
      }
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["client-bookings"] });
      queryClient.invalidateQueries({ queryKey: ["provider-bookings"] });
    },
  });
};
