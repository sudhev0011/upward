import { ProviderProfile } from '../../../entities/provider-profile.entity';
import { IBaseRepository } from '../base/IBaseRepository';

export interface IProviderProfileRepository extends IBaseRepository<ProviderProfile> {
  getAll(options: {
    page: number;
    limit: number;
    search?: string;
    location?: string;
  }): Promise<{ seekers: (ProviderProfile & { user: { name: string; email: string; _id: string } })[]; total: number }>;
  countTotal(): Promise<number>;
}