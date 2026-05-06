import { providerApi } from "@/api/provider.api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useCreateUnavailabilityMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: providerApi.createUnavailability,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['unavailability'] });
    },
  });
};