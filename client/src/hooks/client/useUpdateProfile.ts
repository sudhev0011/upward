import { clientApi } from "@/api/client.api";
import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/main";

export const useUpdateProfileMutation = () => {
  return useMutation({
    mutationFn: clientApi.updateProfile,

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["authData"] });
      queryClient.invalidateQueries({ queryKey: ["clientProfile"] });
    },
  });
};
