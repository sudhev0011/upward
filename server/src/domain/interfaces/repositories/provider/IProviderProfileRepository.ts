import { ProviderListItem } from "../../../queries/provider/ProviderQueryModel";
import { ProviderProfile } from "../../../entities/provider-profile.entity";
import { IBaseRepository } from "../base/IBaseRepository";

export interface IProviderProfileRepository extends IBaseRepository<ProviderProfile> {
  getAll(options: {
    page: number;
    limit: number;
    search?: string;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
    isBlocked?: boolean;
    isApprovedByAdmin?: boolean;
  }): Promise<{ providers: ProviderListItem[]; total: number }>;
  countTotal(): Promise<number>;
}
