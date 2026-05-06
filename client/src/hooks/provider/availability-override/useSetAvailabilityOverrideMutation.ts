import { providerApi } from "@/api/provider.api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useSetAvailabilityOverrideMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: providerApi.setAvailabilityOverride,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['availabilityOverrides'] });
    },
  });
};