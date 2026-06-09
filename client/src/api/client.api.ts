import { api } from "./axios";
import type { ApiEnvelope } from "@/interfaces/auth";
import { ClientRoutes } from "@/constants/api-routes";

import type {
  ClientProfile,
  CreateClientProfileRequest,
  ProfileUpdateUrlRequest,
  ProfileUploadUrls,
  UpdateClientProfileRequest,
} from "@/interfaces/client/client.interface";
import type {
  AvailableSlot,
  GetAvailableSlotsRequest,
  CreateOnsiteBookingRequest,
  Booking,
  CreatePaymentIntentRequest,
  PaymentIntentResponse,
  CreateOffsiteBookingRequest,
} from "@/interfaces/client/booking.interface";
import {
  ListBookingsRequest,
  ListBookingsResponse,
  WalletResponse,
} from "@/interfaces/bookings/bookings.interface";

export const clientApi = {
  async getProfile(): Promise<ApiEnvelope<ClientProfile>> {
    return (await api.get<ApiEnvelope<ClientProfile>>(ClientRoutes.PROFILE))
      .data;
  },

  async createProfile(
    data: CreateClientProfileRequest,
  ): Promise<ApiEnvelope<ClientProfile>> {
    return (
      await api.post<ApiEnvelope<ClientProfile>>(ClientRoutes.PROFILE, data)
    ).data;
  },

  async updateProfile(
    data: UpdateClientProfileRequest,
  ): Promise<ApiEnvelope<ClientProfile>> {
    return (
      await api.put<ApiEnvelope<ClientProfile>>(ClientRoutes.PROFILE, data)
    ).data;
  },

  async getUploadProfileUrl(
    data: ProfileUpdateUrlRequest,
  ): Promise<ApiEnvelope<ProfileUploadUrls>> {
    return (
      await api.post<ApiEnvelope<ProfileUploadUrls>>(
        ClientRoutes.PROFILE_UPLOAD_URL,
        data,
      )
    ).data;
  },

  async getAvailableSlots(
    params: GetAvailableSlotsRequest,
  ): Promise<ApiEnvelope<AvailableSlot[]>> {
    const { providerId, providerServiceId, date } = params;
    return (
      await api.get<ApiEnvelope<AvailableSlot[]>>(
        ClientRoutes.AVAILABLE_SLOTS(providerId, providerServiceId),
        { params: { date } },
      )
    ).data;
  },

  async createOnsiteBooking(
    data: CreateOnsiteBookingRequest,
  ): Promise<ApiEnvelope<Booking>> {
    return (
      await api.post<ApiEnvelope<Booking>>(ClientRoutes.BOOKINGS_ONSITE, data)
    ).data;
  },

  async createOffsiteBooking(
    data: CreateOffsiteBookingRequest,
  ): Promise<ApiEnvelope<Booking>> {
    return (
      await api.post<ApiEnvelope<Booking>>(ClientRoutes.BOOKINGS_OFFSITE, data)
    ).data;
  },

  async createPaymentIntent(
    data: CreatePaymentIntentRequest,
  ): Promise<ApiEnvelope<PaymentIntentResponse>> {
    return (
      await api.post<ApiEnvelope<PaymentIntentResponse>>(
        ClientRoutes.PAYMENT_CREATE_INTENT,
        data,
      )
    ).data;
  },

  async listBookings(
    params: ListBookingsRequest,
  ): Promise<ApiEnvelope<ListBookingsResponse>> {
    return (
      await api.get<ApiEnvelope<ListBookingsResponse>>(ClientRoutes.BOOKINGS, {
        params,
      })
    ).data;
  },

  async cancelBooking(
    bookingId: string,
    reason?: string | null,
  ): Promise<ApiEnvelope<void>> {
    return (
      await api.patch<ApiEnvelope<void>>(
        `${ClientRoutes.BOOKINGS}/${bookingId}/cancel`,
        { reason },
      )
    ).data;
  },

  async getWallet(): Promise<ApiEnvelope<WalletResponse>> {
    return (await api.get<ApiEnvelope<WalletResponse>>("/api/client/wallet"))
      .data;
  },
};
