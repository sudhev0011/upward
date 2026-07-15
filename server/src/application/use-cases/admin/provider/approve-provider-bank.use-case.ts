import { IProviderBankRepository } from "../../../../domain/interfaces/repositories/provider/IProviderBankRepository";
import { IApproveProviderBankUseCase } from "../../../../domain/interfaces/usecases/admin/provider/IApproveProviderBankUseCase";
import { NotFoundError } from "../../../../domain/errors/errors";

export class ApproveProviderBankUseCase implements IApproveProviderBankUseCase {
  constructor(
    private readonly _providerBankRepository: IProviderBankRepository
  ) {}

  async execute(providerId: string): Promise<void> {
    const bank = await this._providerBankRepository.findByProviderId(providerId);

    if (!bank) {
      throw new NotFoundError("Provider bank details not found");
    }

    await this._providerBankRepository.update(bank.id, {
      status: "approved",
    });
  }
}
