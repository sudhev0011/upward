import { adminApi } from "@/api/admin.api";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { queryClient } from "@/main";

export const useBlockProviderMutation = () => {
  return useMutation({
    mutationFn: adminApi.blockProvider,
    onSuccess: () => {
      toast.success("Account status updated");
      queryClient.invalidateQueries({ queryKey: ["providerProfiles"] });
    },
  });
};
