import { SaveProviderBankRequestDto } from "../../../../../application/dtos/provider/kyc/save-provider-bank.dto";
import { SaveProviderBankResponseDto } from "../../../../../application/dtos/provider/kyc/save-provider-bank-response.dto";
export interface ISaveProviderBankUseCase {
  execute(dto: SaveProviderBankRequestDto): Promise<SaveProviderBankResponseDto>;
}
