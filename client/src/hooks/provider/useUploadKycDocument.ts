import { useMutation } from '@tanstack/react-query';
import { providerApi } from '@/api/provider.api';

export const useUploadKycDocument = () => {
  return useMutation({
    mutationFn: (data: { fileType: string }) => providerApi.uploadKycDocument(data),
  });
};
