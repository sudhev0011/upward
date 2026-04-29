import { GetPaginatedCategoriesDto } from "../../../../../application/dtos/admin/category/request/get-paginated-category-request.dto";
import { GetCategoriesResponseDto } from "../../../../../application/dtos/admin/category/response/paginated-category-response.dto";

export interface IGetAllCategoriesWithPagination {
    execute(query:GetPaginatedCategoriesDto): Promise<GetCategoriesResponseDto>
}