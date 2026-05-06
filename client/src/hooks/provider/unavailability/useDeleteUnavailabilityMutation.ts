import { providerApi } from "@/api/provider.api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useDeleteUnavailabilityMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: providerApi.deleteUnavailability,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['unavailability'] });
    },
  });
};