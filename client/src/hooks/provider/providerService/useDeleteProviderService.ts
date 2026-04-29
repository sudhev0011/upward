import { providerApi } from "@/api/provider.api"
import { useMutation, useQueryClient } from "@tanstack/react-query"

export const useDeleteProviderServiceMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: providerApi.deleteProviderServiceById,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['providerServices'] });
    }
  });
}