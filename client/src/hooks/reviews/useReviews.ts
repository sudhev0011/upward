import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { reviewsApi } from '@/api/reviews.api';

export const useProviderReviewsQuery = (providerId: string, page: number = 1, limit: number = 20) => {
  return useQuery({
    queryKey: ['providerReviews', providerId, page, limit],
    queryFn: () => reviewsApi.getProviderReviews(providerId, page, limit),
    enabled: !!providerId,
  });
};

export const useClientReviewsQuery = (page: number = 1, limit: number = 20) => {
  return useQuery({
    queryKey: ['clientReviews', page, limit],
    queryFn: () => reviewsApi.getClientReviews(page, limit),
  });
};

export const usePendingReviewsQuery = (page: number = 1, limit: number = 20) => {
  return useQuery({
    queryKey: ['pendingReviews', page, limit],
    queryFn: () => reviewsApi.getPendingReviews(page, limit),
  });
};

export const useCreateReviewMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: reviewsApi.createReview,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clientReviews'] });
      queryClient.invalidateQueries({ queryKey: ['pendingReviews'] });
      queryClient.invalidateQueries({ queryKey: ['providerReviews'] });
      queryClient.invalidateQueries({ queryKey: ['providerProfile'] });
    },
  });
};

export const useCompleteBookingMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: reviewsApi.completeBooking,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      queryClient.invalidateQueries({ queryKey: ['provider-bookings'] });
      queryClient.invalidateQueries({ queryKey: ['pendingReviews'] });
    },
  });
};
