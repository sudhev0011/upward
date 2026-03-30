import { IBaseRepository } from "../base/IBaseRepository";
import { ProviderBank } from "../../../entities/provider-bank.entity";

export interface IProviderBankRepository extends IBaseRepository<ProviderBank> {
  findByProviderId(providerId: string): Promise<ProviderBank | null>;
}
