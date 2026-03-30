import { IProviderKycRepository } from '../../../../domain/interfaces/repositories/provider/IProviderKycRepository';
import { ProviderKyc } from '../../../../domain/entities/provider-kyc.entity';
import { ProviderKycModel, ProviderKycDocument } from '../models/provider-kyc.model';
import { RepositoryBase } from './base.repository';
import { ProviderKycMapper } from '../../../mapers.persistence/provider-kyc.mapper';

export class ProviderKycRepository extends RepositoryBase<ProviderKyc, ProviderKycDocument> implements IProviderKycRepository {
  constructor() {
    super(ProviderKycModel);
  }

  protected mapToEntity(doc: ProviderKycDocument): ProviderKyc {
    return ProviderKycMapper.toEntity(doc);
  }

  protected mapToDocument(entity: Partial<ProviderKyc>): Partial<ProviderKycDocument> {
    return ProviderKycMapper.toDocument(entity);
  }

  async findByProviderId(providerId: string): Promise<ProviderKyc | null> {
    const doc = await ProviderKycModel.findOne({ providerId });
    return doc ? this.mapToEntity(doc) : null;
  }
}
