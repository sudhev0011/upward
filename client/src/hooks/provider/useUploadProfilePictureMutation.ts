import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/main";
import axios from "axios";

export interface UploadArgs {
  uploadUrl: string;
  file: File;
}

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

    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['providerProfile'] }),
  });
};
