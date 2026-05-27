import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  subscriptionApi,
  CreateSubscriptionPlanRequest,
  UpdateSubscriptionPlanRequest,
  SubscriptionPlanDto,
  ProviderSubscriptionStatusDto,
  CheckoutResponseDto,
} from "@/api/subscription.api";
import { ApiEnvelope } from "@/interfaces/auth";

export const subscriptionKeys = {
  all: ["subscriptions"] as const,
  adminPlans: () => [...subscriptionKeys.all, "admin", "plans"] as const,
  providerActivePlans: () => [...subscriptionKeys.all, "provider", "active-plans"] as const,
  providerStatus: () => [...subscriptionKeys.all, "provider", "status"] as const,
};

// --- Admin Hooks ---

export const useAdminPlans = () => {
  return useQuery<ApiEnvelope<SubscriptionPlanDto[]>, Error>({
    queryKey: subscriptionKeys.adminPlans(),
    queryFn: () => subscriptionApi.adminGetPlans(),
  });
};

export const useCreateSubscriptionPlan = (options?: {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}) => {
  const queryClient = useQueryClient();
  return useMutation<ApiEnvelope<SubscriptionPlanDto>, Error, CreateSubscriptionPlanRequest>({
    mutationFn: (data: CreateSubscriptionPlanRequest) =>
      subscriptionApi.adminCreatePlan(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: subscriptionKeys.adminPlans() });
      options?.onSuccess?.();
    },
    onError: options?.onError,
  });
};

export const useUpdateSubscriptionPlan = (options?: {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}) => {
  const queryClient = useQueryClient();
  return useMutation<
    ApiEnvelope<SubscriptionPlanDto>,
    Error,
    { id: string; data: UpdateSubscriptionPlanRequest }
  >({
    mutationFn: ({ id, data }) => subscriptionApi.adminUpdatePlan(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: subscriptionKeys.adminPlans() });
      queryClient.invalidateQueries({ queryKey: subscriptionKeys.providerActivePlans() });
      options?.onSuccess?.();
    },
    onError: options?.onError,
  });
};

export const useDeleteSubscriptionPlan = (options?: {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}) => {
  const queryClient = useQueryClient();
  return useMutation<ApiEnvelope<void>, Error, string>({
    mutationFn: (id: string) => subscriptionApi.adminDeletePlan(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: subscriptionKeys.adminPlans() });
      queryClient.invalidateQueries({ queryKey: subscriptionKeys.providerActivePlans() });
      options?.onSuccess?.();
    },
    onError: options?.onError,
  });
};

// --- Provider Hooks ---

export const useProviderActivePlans = () => {
  return useQuery<ApiEnvelope<SubscriptionPlanDto[]>, Error>({
    queryKey: subscriptionKeys.providerActivePlans(),
    queryFn: () => subscriptionApi.providerGetActivePlans(),
  });
};

export const useProviderStatus = () => {
  return useQuery<ApiEnvelope<ProviderSubscriptionStatusDto>, Error>({
    queryKey: subscriptionKeys.providerStatus(),
    queryFn: () => subscriptionApi.providerGetStatus(),
  });
};

export const useCreateSubscriptionCheckout = (options?: {
  onSuccess?: (data: ApiEnvelope<CheckoutResponseDto>) => void;
  onError?: (error: Error) => void;
}) => {
  return useMutation<ApiEnvelope<CheckoutResponseDto>, Error, string>({
    mutationFn: (planId: string) => subscriptionApi.providerCreateCheckout(planId),
    onSuccess: (data) => {
      options?.onSuccess?.(data);
    },
    onError: options?.onError,
  });
};
