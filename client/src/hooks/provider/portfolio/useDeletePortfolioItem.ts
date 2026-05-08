import { providerApi } from "@/api/provider.api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { portfolioKeys } from "./useGetPortfolio";

export const useDeletePortfolioItem = () => {
  const queryClient = useQueryClient();
 
  return useMutation({
    mutationFn: (id: string) => providerApi.deletePortfolioItem(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: portfolioKeys.all });
    },
  });
};