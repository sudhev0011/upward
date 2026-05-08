import { providerApi } from "@/api/provider.api";
import { PORTFOLIO_LIMIT } from "@/constants/portfolio-limit";
import { useInfiniteQuery } from "@tanstack/react-query";

export const portfolioKeys = {
  all: ["portfolio"] as const,
};

export const useGetPortfolio = () => {
  return useInfiniteQuery({
    queryKey: portfolioKeys.all,
    queryFn: ({ pageParam = 1 }) =>
      providerApi.getPortfolio(pageParam as number, PORTFOLIO_LIMIT),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (!lastPage.data?.hasNextPage) return undefined;
      return lastPage.data.page + 1;
    },
  });
};