import { providerApi } from "@/api/provider.api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useConfigureProviderServiceMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: providerApi.setProviderServicePrice,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["providerServices", "list"],
      });
    },
  });
};