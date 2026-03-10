import { ClientProfile } from '../../../entities/client-profile.entity';
import { IBaseRepository } from '../base/IBaseRepository';

export interface IClientProfileRepository extends IBaseRepository<ClientProfile> {
  getAll(options: {
    page: number;
    limit: number;
    search?: string;
    location?: string;
  }): Promise<{ seekers: (ClientProfile & { user: { name: string; email: string; _id: string } })[]; total: number }>;
  countTotal(): Promise<number>;
}