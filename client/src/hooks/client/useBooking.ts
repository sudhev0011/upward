import { useMutation, useQuery } from "@tanstack/react-query";
import { clientApi } from "@/api/client.api";
import type {
  GetAvailableSlotsRequest,
  Booking,
  AvailableSlot,
  CreateOffsiteBookingRequest,
  CreateOnsiteBookingRequest,
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
    staleTime: 0,
    gcTime: 0, 
    retry: 1,
  });
};

// --- Create Booking Mutation ---

export const useCreateOnsiteBooking = (
  onSuccess?: (data: ApiEnvelope<Booking>) => void,
  onError?: (error: Error) => void
) => {
  return useMutation<ApiEnvelope<Booking>, Error, CreateOnsiteBookingRequest>({
    mutationFn: (data: CreateOnsiteBookingRequest) =>
      clientApi.createOnsiteBooking(data),
    onSuccess,
    onError,
  });
};

// --- Offsite Booking Mutation ---

export const useCreateOffsiteBooking = (
  onSuccess?: (data: ApiEnvelope<Booking>) => void,
  onError?: (error: Error) => void
) => {
  return useMutation<ApiEnvelope<Booking>, Error, CreateOffsiteBookingRequest>({
    mutationFn: (data: CreateOffsiteBookingRequest) =>
      clientApi.createOffsiteBooking(data),
    onSuccess,
    onError,
  });
};
