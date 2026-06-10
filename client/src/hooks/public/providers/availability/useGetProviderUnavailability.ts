import { useQuery } from '@tanstack/react-query';
import { publicApi } from '@/api/public.api';

export const useGetProviderUnavailability = (providerId: string) => {
  return useQuery({
    queryKey: ['provider-unavailability', providerId],
    queryFn: () => publicApi.getProviderUnavailability(providerId),
    enabled: !!providerId,
  });
};