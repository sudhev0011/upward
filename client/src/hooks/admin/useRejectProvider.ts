import { adminApi } from "@/api/admin.api";
import { queryClient } from "@/main";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { RejectProviderRequest } from "@/interfaces/admin/provider.interface";

export const useRejectProviderMutation = (dialogCloseCallback: ()=> void) => {
  return useMutation({
    mutationFn: (payload: RejectProviderRequest ) => adminApi.rejectProvider(payload),
    onSuccess: () => {
      toast.error("Provider application rejected");
      queryClient.invalidateQueries({ queryKey: ["providerProfiles"] });
      dialogCloseCallback()
    },
  });
};
