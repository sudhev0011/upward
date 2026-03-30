import { SubmitProviderKycResponseDto } from "../../../../../application/dtos/provider/kyc/submit-provider-kyc-response.dto";

export interface IGetProviderKycUseCase {
  execute(providerId: string): Promise<SubmitProviderKycResponseDto>;
}