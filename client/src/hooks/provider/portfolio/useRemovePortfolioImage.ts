import { providerApi } from "@/api/provider.api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { portfolioKeys } from "./useGetPortfolio";

export const useRemovePortfolioImage = () => {
  const queryClient = useQueryClient();
 
  return useMutation({
    mutationFn: ({ itemId, imageUrl }: { itemId: string; imageUrl: string }) =>
      providerApi.removePortfolioImage(itemId, { imageUrl }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: portfolioKeys.all });
    },
  });
};