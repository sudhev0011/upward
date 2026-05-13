// hooks/queries/useProvidersByCategory.ts
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { publicApi } from '@/api/public.api';
import { GetProvidersByCategoryParams } from '@/interfaces/provider/provider.listing.interface';

export const providerListingKeys = {
  all: ['providers'] as const,
  byCategory: (params: GetProvidersByCategoryParams) =>
    [...providerListingKeys.all, params] as const,
};

export const useProvidersByCategory = (params: GetProvidersByCategoryParams) => {
  return useQuery({
    queryKey: providerListingKeys.byCategory(params),
    queryFn: () => publicApi.getProvidersByCategory(params),
    select: (res) => res.data,
    placeholderData: keepPreviousData, // keeps previous page visible while next loads
    enabled: !!params.category,
  });
};