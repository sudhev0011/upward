import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  subscriptionApi,
  CreateSubscriptionPlanRequest,
  UpdateSubscriptionPlanRequest,
  SubscriptionPlanDto,
  ProviderSubscriptionStatusDto,
  CheckoutResponseDto,
  PaginatedSubscriptionPlanDto,
} from "@/api/subscription.api";
import { ApiEnvelope, ApiErrorResponse } from "@/interfaces/auth";
import { AxiosError } from "axios";

export const subscriptionKeys = {
  all: ["subscriptions"] as const,
  adminPlans: (params?: {
    page: number;
    search: string;
    sort: string;
    sortOrder: "asc" | "desc";
  }) => [...subscriptionKeys.all, "admin", "plans", params] as const,
  providerActivePlans: () =>
    [...subscriptionKeys.all, "provider", "active-plans"] as const,
  providerStatus: () =>
    [...subscriptionKeys.all, "provider", "status"] as const,
};

export const useAdminPlans = (params: {
  page: number;
  search: string;
  sort: string;
  sortOrder: "asc" | "desc";
}) => {
  return useQuery<ApiEnvelope<PaginatedSubscriptionPlanDto>, AxiosError<ApiErrorResponse>>({
    queryKey: subscriptionKeys.adminPlans(params),
    queryFn: () => subscriptionApi.adminGetPlans(params),
  });
};

export const useCreateSubscriptionPlan = (options?: {
  onSuccess?: () => void;
  onError?: (error: AxiosError<ApiErrorResponse>) => void;
}) => {
  const queryClient = useQueryClient();
  return useMutation<
    ApiEnvelope<SubscriptionPlanDto>,
    AxiosError<ApiErrorResponse>,
    CreateSubscriptionPlanRequest
  >({
    mutationFn: (data: CreateSubscriptionPlanRequest) =>
      subscriptionApi.adminCreatePlan(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["subscriptions", "admin", "plans"],
      });
      options?.onSuccess?.();
    },
    onError: options?.onError,
  });
};

export const useUpdateSubscriptionPlan = (options?: {
  onSuccess?: () => void;
  onError?: (error: AxiosError<ApiErrorResponse>) => void;
}) => {
  const queryClient = useQueryClient();
  return useMutation<
    ApiEnvelope<SubscriptionPlanDto>,
    AxiosError<ApiErrorResponse>,
    { id: string; data: UpdateSubscriptionPlanRequest }
  >({
    mutationFn: ({ id, data }) => subscriptionApi.adminUpdatePlan(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["subscriptions", "admin", "plans"],
      });
      queryClient.invalidateQueries({
        queryKey: subscriptionKeys.providerActivePlans(),
      });
      options?.onSuccess?.();
    },
    onError: options?.onError,
  });
};

export const useDeleteSubscriptionPlan = (options?: {
  onSuccess?: () => void;
  onError?: (error: AxiosError<ApiErrorResponse>) => void;
}) => {
  const queryClient = useQueryClient();
  return useMutation<ApiEnvelope<void>, AxiosError<ApiErrorResponse>, string>({
    mutationFn: (id: string) => subscriptionApi.adminDeletePlan(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["subscriptions", "admin", "plans"],
      });
      queryClient.invalidateQueries({
        queryKey: subscriptionKeys.providerActivePlans(),
      });
      options?.onSuccess?.();
    },
    onError: options?.onError,
  });
};

export const useProviderActivePlans = () => {
  return useQuery<ApiEnvelope<SubscriptionPlanDto[]>, AxiosError<ApiErrorResponse>>({
    queryKey: subscriptionKeys.providerActivePlans(),
    queryFn: () => subscriptionApi.providerGetActivePlans(),
  });
};

export const useProviderStatus = () => {
  return useQuery<ApiEnvelope<ProviderSubscriptionStatusDto>, AxiosError<ApiErrorResponse>>({
    queryKey: subscriptionKeys.providerStatus(),
    queryFn: () => subscriptionApi.providerGetStatus(),
  });
};

export const useCreateSubscriptionCheckout = (options?: {
  onSuccess?: (data: ApiEnvelope<CheckoutResponseDto>) => void;
  onError?: (error: AxiosError<ApiErrorResponse>) => void;
}) => {
  return useMutation<ApiEnvelope<CheckoutResponseDto>, AxiosError<ApiErrorResponse>, string>({
    mutationFn: (planId: string) =>
      subscriptionApi.providerCreateCheckout(planId),
    onSuccess: (data) => {
      options?.onSuccess?.(data);
    },
    onError: options?.onError,
  });
};
