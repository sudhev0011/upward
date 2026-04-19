import { adminApi } from "@/api/admin.api";
import { BlockClientRequest } from "@/interfaces/admin/client.interface";
import { queryClient } from "@/main";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export const useBlockClientMutation = () => {
  return useMutation({
    mutationFn: (payload: BlockClientRequest) =>
      adminApi.blockClient(payload),
    onSuccess: () => {
      toast.success("Client account status updated");
      queryClient.invalidateQueries({ queryKey: ["clients"] });
    },
    onError: () => {
      toast.error("Failed to update account status");
    },
  });
};
