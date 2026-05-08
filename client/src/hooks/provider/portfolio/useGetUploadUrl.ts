import { providerApi } from "@/api/provider.api";
import { GetUploadUrlRequest } from "@/interfaces/provider/portfolio.interface";
import { useMutation } from "@tanstack/react-query";

export const useGetUploadUrl = () => {
  return useMutation({
    mutationFn: (params: GetUploadUrlRequest) => providerApi.getUploadUrl(params),
  });
};