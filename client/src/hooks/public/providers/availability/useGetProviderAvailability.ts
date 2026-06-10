import { useQuery } from '@tanstack/react-query';
import { publicApi } from '@/api/public.api';

export const useGetProviderAvailability = (providerId: string) => {
  return useQuery({
    queryKey: ['provider-availability', providerId],
    queryFn: () => publicApi.getProviderAvailability(providerId),
    enabled: !!providerId,
  });
};