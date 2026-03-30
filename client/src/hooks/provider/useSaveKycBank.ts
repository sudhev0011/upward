import { useMutation, } from '@tanstack/react-query';
import { providerApi } from '@/api/provider.api';
import type { SaveKycBankRequest } from '@/interfaces/provider/kyc.interface';
import { queryClient } from '@/main';

export const useSaveKycBank = () => {
  return useMutation({
    mutationFn: (data: SaveKycBankRequest) => providerApi.saveKycBank(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['providerBank'] });
    },
  });
};
