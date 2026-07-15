import { useMutation, useQueryClient } from "@tanstack/react-query";
import { providerApi } from "@/api/provider.api";

export const useCreatePayoutRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (amount: number) => providerApi.createPayoutRequest(amount),
    onSuccess: () => {
      // Invalidate queries so wallet balance and request list refresh
      queryClient.invalidateQueries({ queryKey: ["payouts"] });
      queryClient.invalidateQueries({ queryKey: ["provider-payout-requests"] });
    },
  });
};
