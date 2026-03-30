import { useMutation } from "@tanstack/react-query";
import axios from "axios";

export interface UploadArgs {
  uploadUrl: string;
  file: File;
}

export const useUploadKycToS3Mutation = () => {
  return useMutation({
    mutationFn: async ({ uploadUrl, file }: UploadArgs) => {
      const response = await axios.put(uploadUrl, file, {
        headers: {
          "Content-Type": file.type,
        },
      });
      return response.data;
    },
  });
};
