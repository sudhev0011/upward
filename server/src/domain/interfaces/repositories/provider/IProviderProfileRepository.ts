import { ProviderListItem } from "../../../queries/provider/ProviderQueryModel";
import { ProviderProfile } from "../../../entities/provider-profile.entity";
import { IBaseRepository } from "../base/IBaseRepository";
import { ClientProviderListItem } from "../../../queries/client/client-provider-list-item";

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

  getProvidersByCategory(options: {
    category: string;
    page: number;
    limit: number;
    minRating?: number;
    location?: string;
    sortBy?: "ratingAvg" | "createdAt";
    sortOrder?: "asc" | "desc";
  }): Promise<{ providers: ClientProviderListItem[]; total: number }>;

  addCategoryIfAbsent(providerId: string, categoryName: string): Promise<void>;
}
