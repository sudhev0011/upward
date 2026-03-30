import { useMutation } from '@tanstack/react-query';
import { providerApi } from '@/api/provider.api';
import type { SubmitKycIdentityRequest } from '@/interfaces/provider/kyc.interface';
import { queryClient } from '@/main';

export const useSubmitKycIdentity = () => {
  return useMutation({
    mutationFn: (data: SubmitKycIdentityRequest) => providerApi.submitKycIdentity(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['kycData'] });
    },
  });
};
