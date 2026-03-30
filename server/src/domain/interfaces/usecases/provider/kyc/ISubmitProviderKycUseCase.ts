import { SubmitProviderKycRequestDto } from "../../../../../application/dtos/provider/kyc/submit-provider-kyc.dto";

export interface ISubmitProviderKycUseCase {
  execute(dto: SubmitProviderKycRequestDto): Promise<void>;
}
