import { adminApi } from "@/api/admin.api"
import { useMutation } from "@tanstack/react-query"
import { queryClient } from "@/main"
import { toast } from "sonner"
export const useApproveProviderMutation = (dialogCloseCallback: ()=> void )=>{
    return useMutation({
    mutationFn: adminApi.approveProvider,
    onSuccess: () => {
      toast.success("Provider approved successfully");
      queryClient.invalidateQueries({ queryKey: ["providerProfiles"] });
      dialogCloseCallback();
    },
  })
}