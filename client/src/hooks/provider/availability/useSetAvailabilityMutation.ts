import { useMutation, useQueryClient } from "@tanstack/react-query";
import { providerApi } from "@/api/provider.api";

export const useSetAvailabilityMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: providerApi.setAvailability,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['availability'] });
    },
  });
};