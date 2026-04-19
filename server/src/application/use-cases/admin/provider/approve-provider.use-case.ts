import { IProviderProfileRepository } from "../../../../domain/interfaces/repositories/provider/IProviderProfileRepository";
import { IApproveProviderUseCase } from "../../../../domain/interfaces/usecases/admin/provider/IApproveProviderUseCase";
import { ApproveProviderDto } from "../../../dtos/admin/provider/request/approve-provider-request.dto";
import { NotFoundError } from "../../../../domain/errors/errors";
import { IProviderKycRepository } from "../../../../domain/interfaces/repositories/provider/IProviderKycRepository";

export class ApproveProviderUseCase implements IApproveProviderUseCase {
  constructor(
    private readonly _providerProfileRepository: IProviderProfileRepository,
    private readonly _providerKycRepository: IProviderKycRepository,
  ) {}

  async execute(data: ApproveProviderDto): Promise<void> {
    const { userId, isApprovedByAdmin } = data;

    const profile = await this._providerProfileRepository.findOne({ userId });

    if (!profile) {
      throw new NotFoundError("Provider profile not found");
    }

    await this._providerProfileRepository.update(profile.id, {
      isApprovedByAdmin,
    });

    const kycRepo = await this._providerKycRepository.findByProviderId(userId);
    if (!kycRepo) {
      throw new NotFoundError("KYC document not found");
    }
    
    await this._providerKycRepository.update(kycRepo.id, {
      status: "approved",
      reason: "",
    });
  }
}
