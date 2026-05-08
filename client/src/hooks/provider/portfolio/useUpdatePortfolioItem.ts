import { providerApi } from "@/api/provider.api";
import { UpdatePortfolioItemRequest } from "@/interfaces/provider/portfolio.interface";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { portfolioKeys } from "./useGetPortfolio";

export const useUpdatePortfolioItem = () => {
  const queryClient = useQueryClient();
 
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdatePortfolioItemRequest }) =>
      providerApi.updatePortfolioItem(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: portfolioKeys.all });
    },
  });
};