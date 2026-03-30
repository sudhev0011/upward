import { ISubmitProviderKycUseCase } from "../../../../domain/interfaces/usecases/provider/kyc/ISubmitProviderKycUseCase";
import { SubmitProviderKycRequestDto } from "../../../dtos/provider/kyc/submit-provider-kyc.dto";
import { IProviderKycRepository } from "../../../../domain/interfaces/repositories/provider/IProviderKycRepository";
import { IS3Service } from "../../../../domain/interfaces/services/IS3Service";
import { ProviderKycMapper } from "../../../mapers/provider/provider-kyc.mappers";
import { IEncryptionService } from "../../../../domain/interfaces/services/IEncryptionService";

export class SubmitProviderKycUseCase implements ISubmitProviderKycUseCase {
  constructor(
    private readonly _kycRepository: IProviderKycRepository,
    private readonly _s3Service: IS3Service,
    private readonly _encryptionService: IEncryptionService,
  ) {}

  async execute(dto: SubmitProviderKycRequestDto): Promise<void> {
    const existingKyc = await this._kycRepository.findByProviderId(
      dto.providerId,
    );

    const encryptedAadhaar = this._encryptionService.encrypt(dto.aadhaarNumber);

    if (existingKyc) {
      if (
        existingKyc.aadhaarFrontUrl !== dto.aadhaarFrontUrl &&
        existingKyc.aadhaarFrontUrl
      ) {
        await this._s3Service.deleteFile(existingKyc.aadhaarFrontUrl);
      }

      if (
        existingKyc.aadhaarBackUrl !== dto.aadhaarBackUrl &&
        existingKyc.aadhaarBackUrl
      ) {
        await this._s3Service.deleteFile(existingKyc.aadhaarBackUrl);
      }

      await this._kycRepository.update(existingKyc.id, {
        fullName: dto.fullName,
        aadhaarNumber: encryptedAadhaar,
        dateOfBirth: new Date(dto.dateOfBirth),
        address: dto.address,
        aadhaarFrontUrl: dto.aadhaarFrontUrl,
        aadhaarBackUrl: dto.aadhaarBackUrl,
        status: "pending",
        updatedAt: new Date(),
      });

      return;
    }

    await this._kycRepository.create(
      ProviderKycMapper.toEntity({
        providerId: dto.providerId,
        fullName: dto.fullName,
        aadhaarNumber: encryptedAadhaar,
        dateOfBirth: new Date(dto.dateOfBirth),
        address: dto.address,
        aadhaarFrontUrl: dto.aadhaarFrontUrl,
        aadhaarBackUrl: dto.aadhaarBackUrl,
        status: "pending",
      }),
    );
  }
}
