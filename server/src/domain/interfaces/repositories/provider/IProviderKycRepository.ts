import { IBaseRepository } from "../base/IBaseRepository";
import { ProviderKyc } from "../../../entities/provider-kyc.entity";

export interface IProviderKycRepository extends IBaseRepository<ProviderKyc> {
  findByProviderId(providerId: string): Promise<ProviderKyc | null>;
}
