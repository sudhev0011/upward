import { api } from "./axios";
import { SubscriptionRoutes } from "@/constants/api-routes";
import { ApiEnvelope } from "@/interfaces/auth";

export interface SubscriptionPlanDto {
  id: string;
  name: string;
  price: number;
  billingCycle: "monthly" | "yearly";
  features: string[];
  subscriberCount: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProviderSubscriptionDto {
  id: string;
  providerId: string;
  planId: string;
  amount: number;
  status: "pending" | "active" | "expired" | "cancelled";
  startDate: string | null;
  endDate: string | null;
  stripePaymentIntentId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ProviderSubscriptionStatusDto {
  activeSubscriptionExpiresAt: string | null;
  activeSubscriptionPlanName: string | null;
  history: ProviderSubscriptionDto[];
}

export interface CreateSubscriptionPlanRequest {
  name: string;
  price: number;
  billingCycle: "monthly" | "yearly";
  features: string[];
  isActive?: boolean;
}

export interface UpdateSubscriptionPlanRequest {
  name?: string;
  price?: number;
  billingCycle?: "monthly" | "yearly";
  features?: string[];
  isActive?: boolean;
}

export interface CheckoutResponseDto {
  clientSecret: string;
  subscription: ProviderSubscriptionDto;
}

export const subscriptionApi = {
  async adminGetPlans(): Promise<ApiEnvelope<SubscriptionPlanDto[]>> {
    const res = await api.get<ApiEnvelope<SubscriptionPlanDto[]>>(
      SubscriptionRoutes.ADMIN_PLANS,
    );
    return res.data;
  },

  async adminCreatePlan(
    data: CreateSubscriptionPlanRequest,
  ): Promise<ApiEnvelope<SubscriptionPlanDto>> {
    const res = await api.post<ApiEnvelope<SubscriptionPlanDto>>(
      SubscriptionRoutes.ADMIN_PLANS,
      data,
    );
    return res.data;
  },

  async adminUpdatePlan(
    id: string,
    data: UpdateSubscriptionPlanRequest,
  ): Promise<ApiEnvelope<SubscriptionPlanDto>> {
    const res = await api.patch<ApiEnvelope<SubscriptionPlanDto>>(
      SubscriptionRoutes.ADMIN_PLAN_BY_ID.replace(":id", id),
      data,
    );
    return res.data;
  },

  async adminDeletePlan(id: string): Promise<ApiEnvelope<void>> {
    const res = await api.delete<ApiEnvelope<void>>(
      SubscriptionRoutes.ADMIN_PLAN_BY_ID.replace(":id", id),
    );
    return res.data;
  },

  async providerGetActivePlans(): Promise<ApiEnvelope<SubscriptionPlanDto[]>> {
    const res = await api.get<ApiEnvelope<SubscriptionPlanDto[]>>(
      SubscriptionRoutes.PROVIDER_ACTIVE_PLANS,
    );
    return res.data;
  },

  async providerCreateCheckout(
    planId: string,
  ): Promise<ApiEnvelope<CheckoutResponseDto>> {
    const res = await api.post<ApiEnvelope<CheckoutResponseDto>>(
      SubscriptionRoutes.PROVIDER_CHECKOUT,
      { planId },
    );
    return res.data;
  },

  async providerGetStatus(): Promise<ApiEnvelope<ProviderSubscriptionStatusDto>> {
    const res = await api.get<ApiEnvelope<ProviderSubscriptionStatusDto>>(
      SubscriptionRoutes.PROVIDER_STATUS,
    );
    return res.data;
  },
};
