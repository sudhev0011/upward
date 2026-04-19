import { ProviderListItem } from "../../../../../domain/queries/provider/ProviderQueryModel";

export interface PaginatedProvidersResultDto {
  providers: ProviderListItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
