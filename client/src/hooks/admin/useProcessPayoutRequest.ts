import { useMutation, useQueryClient } from "@tanstack/react-query";
import { adminApi } from "@/api/admin.api";

export const useProcessPayoutRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: { status: "transferred" | "rejected"; adminNotes?: string } }) =>
      adminApi.processPayoutRequest(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-payout-requests"] });
    },
  });
};
