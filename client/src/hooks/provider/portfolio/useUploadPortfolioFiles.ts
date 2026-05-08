import { providerApi } from "@/api/provider.api";
import { GetUploadUrlRequest } from "@/interfaces/provider/portfolio.interface";
import { useMutation } from "@tanstack/react-query";

export const useUploadPortfolioFiles = () => {
  return useMutation({
    mutationFn: async (files: File[]) => {
      const results: { fileUrl: string; storageKey: string }[] = [];
 
      for (const file of files) {
        console.log(file)
        const res = await providerApi.getUploadUrl({
          fileName: file.name,
          contentType: file.type as GetUploadUrlRequest["contentType"],
        });
 
        if (!res.success || !res.data) throw new Error("Failed to get upload URL");
 
        await providerApi.uploadFileToS3(res.data.uploadUrl, file);
 
        results.push({
          fileUrl: res.data.fileUrl,
          storageKey: res.data.storageKey,
        });
      }
 
      return results;
    },
  });
};