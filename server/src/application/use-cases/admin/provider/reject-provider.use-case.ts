import { NotFoundError } from "../../../../domain/errors/errors";
import { IProviderKycRepository } from "../../../../domain/interfaces/repositories/provider/IProviderKycRepository";
import { IProviderProfileRepository } from "../../../../domain/interfaces/repositories/provider/IProviderProfileRepository";
import { IRejectProviderUseCase } from "../../../../domain/interfaces/usecases/admin/provider/IRejectProviderUseCase";
import { RejectProviderDto } from "../../../dtos/admin/provider/request/reject-provider-request.dto";

export class RejectProviderUseCase implements IRejectProviderUseCase {
  constructor(
    private readonly _providerKycRepository: IProviderKycRepository,
    private readonly _providerProfileRepository: IProviderProfileRepository,
  ) {}
  async execute(data: RejectProviderDto): Promise<void> {
    const { isApprovedByAdmin, reason, userId } = data;

    const profile = await this._providerProfileRepository.findOne({ userId });

    if (!profile) {
      throw new NotFoundError("Provider profile not found");
    }

    const kycRepo = await this._providerKycRepository.findByProviderId(userId)

    if(!kycRepo){
        throw new NotFoundError("KYC document not found");
    }

    await this._providerProfileRepository.update(profile.id, {
      isApprovedByAdmin,
    });

    await this._providerKycRepository.update(kycRepo.id,{reason})
  }
}
