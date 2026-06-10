import { useQuery } from '@tanstack/react-query';
import { publicApi } from '@/api/public.api';

export const useGetProviderProfile = (providerId: string) => {
  return useQuery({
    queryKey: ['provider-profile', providerId],
    queryFn: () => publicApi.getProviderProfile(providerId),
    enabled: !!providerId,
  });
};