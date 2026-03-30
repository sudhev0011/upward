import { IProviderBankRepository } from '../../../../domain/interfaces/repositories/provider/IProviderBankRepository';
import { ProviderBank } from '../../../../domain/entities/provider-bank.entity';
import { ProviderBankModel, ProviderBankDocument } from '../models/provider-bank.model';
import { RepositoryBase } from './base.repository';
import { ProviderBankMapper } from '../../../mapers.persistence/provider-bank.mapper';

export class ProviderBankRepository extends RepositoryBase<ProviderBank, ProviderBankDocument> implements IProviderBankRepository {
  constructor() {
    super(ProviderBankModel);
  }

  protected mapToEntity(doc: ProviderBankDocument): ProviderBank {
    return ProviderBankMapper.toEntity(doc);
  }

  protected mapToDocument(entity: Partial<ProviderBank>): Partial<ProviderBankDocument> {
    return ProviderBankMapper.toDocument(entity as ProviderBank);
  }

  async findByProviderId(providerId: string): Promise<ProviderBank | null> {
    const doc = await ProviderBankModel.findOne({ providerId }).exec();
    return doc ? this.mapToEntity(doc) : null;
  }
}
