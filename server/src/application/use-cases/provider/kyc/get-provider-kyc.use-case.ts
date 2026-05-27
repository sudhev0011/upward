import { NotFoundError } from "../../../../domain/errors/errors";
import { IProviderKycRepository } from "../../../../domain/interfaces/repositories/provider/IProviderKycRepository";
import { IEncryptionService } from "../../../../domain/interfaces/services/IEncryptionService";
import { IS3Service } from "../../../../domain/interfaces/services/IS3Service";
import { IGetProviderKycUseCase } from "../../../../domain/interfaces/usecases/provider/kyc/IGetProviderKycUseCase";
import { SubmitProviderKycResponseDto } from "../../../dtos/provider/kyc/submit-provider-kyc-response.dto";
import { ProviderKycMapper } from "../../../mapers/provider/provider-kyc.mappers";

export class GetProviderKycUseCase implements IGetProviderKycUseCase {
  constructor(
    private readonly _kycRepository: IProviderKycRepository,
    private readonly _s3Service: IS3Service,
    private readonly _encryptionService: IEncryptionService
  ) {}

  async execute(providerId: string): Promise<SubmitProviderKycResponseDto> {
    const kycData = await this._kycRepository.findByProviderId(providerId);
    console.log(kycData)
    if (!kycData) {
      throw new NotFoundError("KYC data is not found");
    }

    const updateFrontUrl = await this._s3Service.generateDownloadUrl(kycData.aadhaarFrontUrl)
    const updateBackUrl = await this._s3Service.generateDownloadUrl(kycData.aadhaarBackUrl)

    const decryptedAdhaarNumber = await this._encryptionService.decrypt(kycData.aadhaarNumber)


    return ProviderKycMapper.toResponse({...kycData, aadhaarNumber: decryptedAdhaarNumber, aadhaarFrontUrl:updateFrontUrl,aadhaarBackUrl:updateBackUrl});

    
  }
}
