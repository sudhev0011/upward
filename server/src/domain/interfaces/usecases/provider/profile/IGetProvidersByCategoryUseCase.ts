import { GetProvidersByCategoryRequestDto } from "../../../../../application/dtos/provider/profile/info/request/get-providers-by-category-request.dto";
import { PaginatedResult } from "../../../../common.types";
import { ClientProviderListItem } from "../../../../queries/client/client-provider-list-item";

export interface IGetProvidersByCategoryUseCase {
  execute(dto: GetProvidersByCategoryRequestDto): Promise<PaginatedResult<ClientProviderListItem>>;
}