import { useMutation, useQuery } from "@tanstack/react-query";
import { clientApi } from "@/api/client.api";
import type {
  GetAvailableSlotsRequest,
  CreateBookingRequest,
  Booking,
  AvailableSlot,
} from "@/interfaces/client/booking.interface";
import type { ApiEnvelope } from "@/interfaces/auth";

// --- Query Keys ---

export const bookingKeys = {
  all: ["bookings"] as const,
  slots: (params: GetAvailableSlotsRequest) =>
    ["bookings", "slots", params.providerId, params.providerServiceId, params.date] as const,
};

// --- Available Slots Query ---

export const useAvailableSlots = (
  params: GetAvailableSlotsRequest,
  enabled: boolean
) => {
  return useQuery<ApiEnvelope<AvailableSlot[]>, Error>({
    queryKey: bookingKeys.slots(params),
    queryFn: () => clientApi.getAvailableSlots(params),
    enabled: enabled && !!params.date && !!params.providerId && !!params.providerServiceId,
    staleTime: 1000 * 60 * 2, // 2 minutes — slots can change, don't cache too long
    retry: 1,
  });
};

// --- Create Booking Mutation ---

export const useCreateBooking = (
  onSuccess?: (data: ApiEnvelope<Booking>) => void,
  onError?: (error: Error) => void
) => {
  return useMutation<ApiEnvelope<Booking>, Error, CreateBookingRequest>({
    mutationFn: (data: CreateBookingRequest) => clientApi.createBooking(data),
    onSuccess,
    onError,
  });
};