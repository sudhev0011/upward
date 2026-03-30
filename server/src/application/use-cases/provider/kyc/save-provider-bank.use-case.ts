import { ISaveProviderBankUseCase } from "../../../../domain/interfaces/usecases/provider/kyc/ISaveProviderBankUseCase";
import { SaveProviderBankRequestDto } from "../../../dtos/provider/kyc/save-provider-bank.dto";
import { SaveProviderBankResponseDto } from "../../../dtos/provider/kyc/save-provider-bank-response.dto";
import { IProviderBankRepository } from "../../../../domain/interfaces/repositories/provider/IProviderBankRepository";
import { IS3Service } from "../../../../domain/interfaces/services/IS3Service";
import { ProviderBankMapper } from "../../../mapers/provider/provider-bank-mapper";
import { IEncryptionService } from "../../../../domain/interfaces/services/IEncryptionService";

export class SaveProviderBankUseCase implements ISaveProviderBankUseCase {
  constructor(
    private readonly _bankRepository: IProviderBankRepository,
    private readonly _s3Service: IS3Service,
    private readonly _encryptionService: IEncryptionService,
  ) {}

  async execute(
    dto: SaveProviderBankRequestDto,
  ): Promise<SaveProviderBankResponseDto> {
    const existingBank = await this._bankRepository.findByProviderId(
      dto.providerId,
    );

    const encryptedAccountNumber = this._encryptionService.encrypt(
      dto.accountNumber,
    );
    const encryptedIfsc = this._encryptionService.encrypt(dto.ifscCode);

    if (existingBank) {
      if (
        existingBank.passbookUrl !== dto.passbookUrl &&
        existingBank.passbookUrl
      ) {
        await this._s3Service.deleteFile(existingBank.passbookUrl);
      }

      const entity = await this._bankRepository.update(existingBank.id, {
        accountHolderName: dto.accountHolderName,
        bankName: dto.bankName,
        accountNumber: encryptedAccountNumber,
        ifscCode: encryptedIfsc,
        branchName: dto.branchName,
        passbookUrl: dto.passbookUrl,
        updatedAt: new Date(),
      });

      if (entity !== null) {
        return ProviderBankMapper.toResponse(entity);
      }
    }

    const entity = await this._bankRepository.create(
      ProviderBankMapper.toEntity({
        providerId: dto.providerId,
        accountHolderName: dto.accountHolderName,
        bankName: dto.bankName,
        accountNumber: encryptedAccountNumber,
        ifscCode: encryptedIfsc,
        branchName: dto.branchName,
        passbookUrl: dto.passbookUrl,
        status: "pending",
      }),
    );

    return ProviderBankMapper.toResponse(entity);
  }
}
