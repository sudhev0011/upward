// hooks/public/providers/useGetProviderActiveServices.ts
import { useQuery } from '@tanstack/react-query';
import { publicApi } from '@/api/public.api';

export const useGetProviderActiveServices = (providerId: string) => {
  return useQuery({
    queryKey: ['provider-active-services', providerId],
    queryFn: () => publicApi.getProviderActiveServices(providerId),
    enabled: !!providerId,
    select: (res) => res.data ?? [],
  });
};