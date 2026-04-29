import { GetPaginatedProviderServicesDto } from "../../../../../application/dtos/provider/providerService/request/get-paginates-provider-services.dto";
import { PaginatedProviderServicesGroupedByCategoryDto } from "../../../../../application/dtos/provider/providerService/response/provider-services-grouped-by-category.dto";

export interface IGetProviderServicesByCategoryUseCase{
    execute(data:{providerId: string; query:GetPaginatedProviderServicesDto;}): Promise<PaginatedProviderServicesGroupedByCategoryDto>
}