import { NotFoundError } from "../../../../domain/errors/errors";
import { ITransactionManager } from "../../../../domain/interfaces/database/transaction-manager.interface";
import { IProviderProfileRepository } from "../../../../domain/interfaces/repositories/provider/IProviderProfileRepository";
import { IProviderServiceRepository } from "../../../../domain/interfaces/repositories/provider/IProviderServiceRepository";
import { IDeleteProviderServiceUseCase } from "../../../../domain/interfaces/usecases/provider/providerService/IDeleteProviderServiceUseCase";

export class DeleteProviderServiceUseCase implements IDeleteProviderServiceUseCase {
  constructor(
    private readonly _providerServiceRepository: IProviderServiceRepository,
    private readonly _transactionManager: ITransactionManager,
    private readonly _providerProfileRepository: IProviderProfileRepository,
  ) {}
  async execute(id: string): Promise<boolean> {
    const result =
      await this._providerServiceRepository.hasOtherServicesInSameCategory(id);

    if (!result.hasOtherServices) {
      let res = null;
      await this._transactionManager.runInTransaction(async (transaction) => {
        res = await this._providerServiceRepository.delete(id, transaction);

        await this._providerProfileRepository.removeCategory(
          result.providerId,
          result.categoryName,
          transaction,
        );
      });
      if (!res) {
        throw new NotFoundError();
      }

      return res;
    } else {
      const result = await this._providerServiceRepository.delete(id);

      if (!result) {
        throw new NotFoundError();
      }

      return result;
    }
  }
}
