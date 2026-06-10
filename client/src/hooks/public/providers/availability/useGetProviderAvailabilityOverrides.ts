import { useQuery } from '@tanstack/react-query';
import { publicApi } from '@/api/public.api';

export const useGetProviderAvailabilityOverrides = (providerId: string) => {
  return useQuery({
    queryKey: ['provider-availability-overrides', providerId],
    queryFn: () => publicApi.getProviderAvailabilityOverrides(providerId),
    enabled: !!providerId,
  });
};