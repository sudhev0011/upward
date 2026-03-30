import { NotFoundError } from "../../../../domain/errors/errors";
import { IProviderBankRepository } from "../../../../domain/interfaces/repositories/provider/IProviderBankRepository";
import { IEncryptionService } from "../../../../domain/interfaces/services/IEncryptionService";
import { IS3Service } from "../../../../domain/interfaces/services/IS3Service";
import { IGetProviderBankUseCase } from "../../../../domain/interfaces/usecases/provider/kyc/IGetProviderBankUseCase";
import { SaveProviderBankResponseDto } from "../../../dtos/provider/kyc/save-provider-bank-response.dto";
import { ProviderBankMapper } from "../../../mapers/provider/provider-bank-mapper";

export class GetProviderBankUseCase implements IGetProviderBankUseCase {
  constructor(
    private readonly _bankRespository: IProviderBankRepository,
    private readonly _s3Service: IS3Service,
    private readonly _encryptionService: IEncryptionService
) {}

  async execute(providerId: string): Promise<SaveProviderBankResponseDto> {
    const bankData = await this._bankRespository.findByProviderId(providerId);

    if (!bankData) {
      throw new NotFoundError("Bank data is not found");
    }

    const updatePassbookUrl = await this._s3Service.generateDownloadUrl(bankData.passbookUrl);

    const decryptedAccountNumber = await this._encryptionService.decrypt(bankData.accountNumber);
    const decryptedIfsc = await this._encryptionService.decrypt(bankData.ifscCode)

    return ProviderBankMapper.toResponse({...bankData, passbookUrl:updatePassbookUrl, accountNumber: decryptedAccountNumber, ifscCode:decryptedIfsc})
  }
}
