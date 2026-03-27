import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/main";
import axios from "axios";
import type{ UploadArgs } from "@/interfaces/client/client.interface";

export const useUploadProfilePictureMutation = () => {
  return useMutation({
    mutationFn: async ({ uploadUrl, file }: UploadArgs) => {
      const response = await axios.put(uploadUrl, file, {
        headers: {
          "Content-Type": file.type,
        },
      });
      return response.data;
    },

    onSuccess: ()=> queryClient.invalidateQueries({queryKey:['clientProfile']}),
    
  });
};
