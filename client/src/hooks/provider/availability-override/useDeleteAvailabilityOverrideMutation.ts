import { providerApi } from "@/api/provider.api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useDeleteAvailabilityOverrideMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: providerApi.deleteAvailabilityOverride,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['availabilityOverrides'] });
    },
  });
};