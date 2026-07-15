import { useMutation, useQueryClient } from "@tanstack/react-query";
import { adminApi } from "@/api/admin.api";

export const useApproveAdminProviderBank = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (providerId: string) => adminApi.approveProviderBank(providerId),
    onSuccess: (_, providerId) => {
      // Invalidate queries to refresh state in UI
      queryClient.invalidateQueries({ queryKey: ["adminProviderBank", providerId] });
      queryClient.invalidateQueries({ queryKey: ["providers"] });
    },
  });
};
