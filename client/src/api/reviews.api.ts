import { api } from './axios';
import type { ApiEnvelope } from '@/interfaces/auth';
import type { Review } from '@/interfaces/reviews/reviews.interface';
import type { BookingListItem } from '@/interfaces/bookings/bookings.interface';
import { ReviewRoutes } from '@/constants/api-routes';

export const reviewsApi = {
  async createReview(payload: {
    bookingId: string;
    rating: number;
    comment: string | null;
  }): Promise<ApiEnvelope<Review>> {
    return (await api.post<ApiEnvelope<Review>>(ReviewRoutes.CREATE, payload)).data;
  },

  async getProviderReviews(
    providerId: string,
    page: number = 1,
    limit: number = 20
  ): Promise<ApiEnvelope<{ data: Review[]; total: number }>> {
    return (
      await api.get<ApiEnvelope<{ data: Review[]; total: number }>>(
        ReviewRoutes.GET_PROVIDER_REVIEWS.replace(':providerId', providerId),
        { params: { page, limit } }
      )
    ).data;
  },

  async getClientReviews(
    page: number = 1,
    limit: number = 20
  ): Promise<ApiEnvelope<{ data: Review[]; total: number }>> {
    return (
      await api.get<ApiEnvelope<{ data: Review[]; total: number }>>(
        ReviewRoutes.GET_CLIENT_REVIEWS,
        { params: { page, limit } }
      )
    ).data;
  },

  async getPendingReviews(
    page: number = 1,
    limit: number = 20
  ): Promise<ApiEnvelope<{ data: BookingListItem[]; total: number }>> {
    return (
      await api.get<ApiEnvelope<{ data: BookingListItem[]; total: number }>>(
        ReviewRoutes.GET_PENDING,
        { params: { page, limit } }
      )
    ).data;
  },

  async completeBooking(bookingId: string): Promise<ApiEnvelope<null>> {
    return (
      await api.patch<ApiEnvelope<null>>(ReviewRoutes.COMPLETE_BOOKING.replace(':id', bookingId))
    ).data;
  },
};
