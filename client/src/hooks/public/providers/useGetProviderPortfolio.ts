// hooks/public/providers/useGetProviderPortfolio.ts
import { useInfiniteQuery } from '@tanstack/react-query';
import { publicApi } from '@/api/public.api';
import { PORTFOLIO_LIMIT } from '@/constants/portfolio-limit';

export const publicPortfolioKeys = {
  all: (providerId: string) => ['provider-portfolio', providerId] as const,
};

export const useGetProviderPortfolio = (providerId: string) => {
  return useInfiniteQuery({
    queryKey: publicPortfolioKeys.all(providerId),
    queryFn: ({ pageParam = 1 }) =>
      publicApi.getProviderPortfolio(providerId, pageParam as number, PORTFOLIO_LIMIT),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (!lastPage.data?.hasNextPage) return undefined;
      return lastPage.data.page + 1;
    },
    enabled: !!providerId,
  });
};