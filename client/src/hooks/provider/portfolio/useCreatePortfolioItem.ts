import { providerApi } from "@/api/provider.api";
import { CreatePortfolioItemRequest } from "@/interfaces/provider/portfolio.interface";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { portfolioKeys } from "./useGetPortfolio";

export const useCreatePortfolioItem = () => {
  const queryClient = useQueryClient();
 
  return useMutation({
    mutationFn: (data: CreatePortfolioItemRequest) =>
      providerApi.createPortfolioItem(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: portfolioKeys.all });
    },
  });
};