import { providerApi } from "@/api/provider.api"
import { useMutation, useQueryClient } from "@tanstack/react-query"

export const useCreateProviderServiceMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: providerApi.createProviderService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['providerServices'] });
    }
  });
}