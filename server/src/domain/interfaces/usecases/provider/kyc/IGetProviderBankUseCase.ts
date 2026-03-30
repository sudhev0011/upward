import { SaveProviderBankResponseDto } from "../../../../../application/dtos/provider/kyc/save-provider-bank-response.dto";
export interface IGetProviderBankUseCase {
  execute(providerId: string): Promise<SaveProviderBankResponseDto>;
}