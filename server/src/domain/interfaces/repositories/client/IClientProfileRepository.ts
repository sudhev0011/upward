import { ClientProfile } from "../../../entities/client-profile.entity";
import { IBaseRepository } from "../base/IBaseRepository";
import { ClientQueryModel } from "../../../queries/provider/ClientQueryModel";
export interface IClientProfileRepository extends IBaseRepository<ClientProfile> {
  getAll(options: {
    page: number;
    limit: number;
    search?: string;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
    isBlocked?: boolean;
  }): Promise<{ clients: ClientQueryModel[]; total: number }>;
  countTotal(): Promise<number>;
}
